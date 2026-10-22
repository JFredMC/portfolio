// Resumen diario de visitas del portfolio (GoatCounter -> correo SES).
// Se ejecuta con GitHub Actions a las 12:00 UTC = 7:00 a. m. America/Bogota.
//
// Variables/secrets requeridos (nunca se imprimen sus valores):
//   GOATCOUNTER_SITE_CODE   código del sitio en GoatCounter (ej. jfredmc)
//   GOATCOUNTER_API_TOKEN   token creado en GoatCounter -> [usuario] -> API
//   AWS_ACCESS_KEY_ID       credenciales del usuario IAM de SES (api_amazon_ses)
//   AWS_SECRET_ACCESS_KEY   idem
//   SES_AWS_REGION          región SES (ej. us-east-1)
//   SES_FROM_EMAIL          remitente verificado en SES
//   STATS_EMAIL_TO          destinatario del resumen (el correo de Jhon)
//
// Uso local:
//   node scripts/portfolio-digest.mjs --sample   # imprime un correo de ejemplo, no envía nada
//   node scripts/portfolio-digest.mjs --dry-run  # trae datos reales y los imprime, no envía
import { createHmac, createHash } from 'node:crypto';

const TZ = 'America/Bogota';

export function previousDayInBogota(now = new Date()) {
  // Fecha de ayer en America/Bogota como YYYY-MM-DD.
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function dayRangeUtc(dateStr) {
  // Bogota es UTC-5 todo el año (sin horario de verano).
  const start = new Date(`${dateStr}T05:00:00Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

const QUERIES = [
  { key: 'total', path: '/stats/total', label: 'total de visitas' },
  { key: 'hits', path: '/stats/hits', label: 'páginas más vistas' },
  { key: 'refs', path: '/stats/toprefs', label: 'referentes' },
  { key: 'locations', path: '/stats/locations', label: 'países' },
  { key: 'browsers', path: '/stats/browsers', label: 'navegadores' },
];

export function failureHint(status) {
  if (status === 401 || status === 403) return 'revisa el token de GoatCounter (puede estar revocado o sin permisos)';
  if (status === 404) return 'revisa GOATCOUNTER_SITE_CODE';
  if (status === 429) return 'límite de consultas de GoatCounter; se reintentó sin éxito';
  if (status >= 500) return 'GoatCounter tuvo un error interno; se reintentó sin éxito';
  if (!status) return 'no hubo respuesta (error de red)';
  return 'respuesta inesperada de GoatCounter';
}

export function formatFailure(f) {
  return `- ${f.label} (${f.path}): ${f.status ? `${f.status}: ` : ''}${failureHint(f.status)}`;
}

export function buildDigest({ date, total, pages = [], refs = [], countries = [], browsers = [], failures = [] }) {
  const list = (items, empty) =>
    items.length ? items.slice(0, 5).map((i) => `- ${i.name}: ${i.count}`).join('\n') : `- ${empty}`;
  const failed = new Set(failures.map((f) => f.key));
  const sec = (key, items, empty) => (failed.has(key) ? '- No disponible (falló la consulta)' : list(items, empty));
  const warning = failures.length
    ? ['⚠️ Atención: algunas consultas a GoatCounter fallaron y el resumen está incompleto:', ...failures.map(formatFailure), '']
    : [];
  const text = [
    `Visitas a tu portfolio — ${date} (America/Bogota)`,
    '',
    ...warning,
    `Páginas vistas / visitas: ${failed.has('total') ? 'No disponible' : total}`,
    '',
    'Secciones y páginas más vistas:',
    sec('hits', pages, 'Sin datos'),
    '',
    'Desde dónde llegaron:',
    sec('refs', refs, 'Sin datos (puede ser tráfico directo)'),
    '',
    'Países:',
    sec('locations', countries, 'Sin datos'),
    '',
    'Navegadores:',
    sec('browsers', browsers, 'Sin datos'),
    '',
    'Panel completo: https://' + (process.env.GOATCOUNTER_SITE_CODE || 'jfredmc') + '.goatcounter.com',
    'Nota: GoatCounter no guarda IPs ni usa cookies; “quién” es país/referente/dispositivo agregado.',
  ].join('\n');
  const head = failed.has('total') ? 'visitas no disponibles' : `${total} visitas`;
  return { subject: `Portfolio: ${head} el ${date}${failures.length ? ' (incompleto)' : ''}`, text };
}

export function buildFailureEmail({ date, failures }) {
  return {
    subject: `Portfolio: no se pudo generar el resumen del ${date}`,
    text: [
      `No se pudo obtener ningún dato de GoatCounter para el ${date} (America/Bogota).`,
      '',
      'Consultas fallidas:',
      ...failures.map(formatFailure),
      '',
      'Revisa el token en GoatCounter -> [tu usuario] -> API y actualiza el secret GOATCOUNTER_API_TOKEN en GitHub.',
    ].join('\n'),
  };
}

export class HttpError extends Error {
  constructor(path, status) {
    super(`GoatCounter ${path} respondió ${status}`);
    this.status = status;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const retryable = (status) => !status || status === 429 || status >= 500;

export async function gc(path, { code, token, start, end, fetchImpl = fetch, retries = 2, delayMs = 2000 }) {
  // /stats/total no acepta `limit` (responde 400); solo se envía a los listados.
  const limit = path === '/stats/total' ? '' : '&limit=10';
  const url = `https://${code}.goatcounter.com/api/v0${path}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}${limit}`;
  for (let attempt = 0; ; attempt++) {
    let status = 0;
    try {
      const res = await fetchImpl(url, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) return await res.json();
      status = res.status;
    } catch (e) {
      if (e instanceof HttpError) throw e;
    }
    if (attempt >= retries || !retryable(status)) throw new HttpError(path, status);
    await sleep(delayMs * (attempt + 1));
  }
}

const names = (json, key) =>
  (json?.[key] ?? json?.stats ?? json?.hits ?? []).map((x) => ({
    name: x.name ?? x.path ?? x.id ?? '—',
    count: x.count ?? 0,
  }));

export async function fetchStats({ code, token, date, fetchImpl, delayMs }) {
  const { start, end } = dayRangeUtc(date);
  // Cada consulta va por separado (en serie, para no provocar 429) y sus fallos no tumban a las demás.
  const data = {};
  const failures = [];
  for (const q of QUERIES) {
    try {
      data[q.key] = await gc(q.path, { code, token, start, end, fetchImpl, delayMs });
    } catch (e) {
      failures.push({ key: q.key, path: q.path, label: q.label, status: e.status ?? 0 });
    }
  }
  return {
    date,
    total: data.total?.total ?? data.total?.total_events ?? 0,
    pages: names(data.hits, 'hits'),
    refs: names(data.refs, 'refs'),
    countries: names(data.locations, 'stats'),
    browsers: names(data.browsers, 'stats'),
    failures,
    allFailed: failures.length === QUERIES.length,
  };
}

// Envío con Amazon SES (API Query v1) firmado con SigV4, sin SDK.
export async function sendSesEmail({ from, to, subject, text }) {
  const region = process.env.SES_AWS_REGION || process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
  const missing = [
    ['SES_AWS_REGION (o AWS_REGION)', region],
    ['AWS_ACCESS_KEY_ID', accessKey],
    ['AWS_SECRET_ACCESS_KEY', secretKey],
    ['SES_FROM_EMAIL', from],
    ['STATS_EMAIL_TO', to],
  ].filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) throw new Error(`Faltan variables: ${missing.join(', ')}`);

  const params = new URLSearchParams({
    Action: 'SendEmail', Version: '2010-12-01',
    Source: from, 'Destination.ToAddresses.member.1': to,
    'Message.Subject.Data': subject, 'Message.Subject.Charset': 'UTF-8',
    'Message.Body.Text.Data': text, 'Message.Body.Text.Charset': 'UTF-8',
  });
  const body = params.toString();
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const host = `email.${region}.amazonaws.com`;
  const canonicalHeaders = `content-type:application/x-www-form-urlencoded\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-date';
  const payloadHash = createHash('sha256').update(body).digest('hex');
  const canonicalRequest = ['POST', '/', '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const scope = `${dateStamp}/${region}/ses/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, createHash('sha256').update(canonicalRequest).digest('hex')].join('\n');
  const hmac = (key, data) => createHmac('sha256', key).update(data).digest();
  const kSigning = hmac(hmac(hmac(hmac(`AWS4${secretKey}`, dateStamp), region), 'ses'), 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  const res = await fetch(`https://${host}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Amz-Date': amzDate,
      Authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    body,
  });
  if (!res.ok) throw new Error(`SES respondió ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

const SAMPLE = {
  date: '2026-10-17', total: 18,
  pages: [{ name: '/portfolio/', count: 12 }, { name: '/portfolio/#projects', count: 4 }, { name: '/portfolio/#contact', count: 2 }],
  refs: [{ name: 'LinkedIn', count: 7 }, { name: 'Google', count: 5 }, { name: '(directo)', count: 6 }],
  countries: [{ name: 'Colombia', count: 11 }, { name: 'México', count: 4 }, { name: 'Estados Unidos', count: 3 }],
  browsers: [{ name: 'Chrome', count: 13 }, { name: 'Safari', count: 5 }],
};

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has('--sample')) {
    const d = buildDigest(SAMPLE);
    console.log(`Subject: ${d.subject}\n\n${d.text}`);
    return;
  }
  const code = process.env.GOATCOUNTER_SITE_CODE || 'jfredmc';
  const token = process.env.GOATCOUNTER_API_TOKEN;
  if (!token) throw new Error('Falta GOATCOUNTER_API_TOKEN (créalo en GoatCounter -> [tu usuario] -> API)');
  const date = previousDayInBogota();
  const stats = await fetchStats({ code, token, date });
  for (const f of stats.failures) {
    // Anotación visible en GitHub Actions (no incluye secretos).
    console.log(`::warning title=GoatCounter::${formatFailure(f).slice(2)}`);
  }
  const digest = stats.allFailed ? buildFailureEmail(stats) : buildDigest(stats);
  if (args.has('--dry-run')) {
    console.log(`Subject: ${digest.subject}\n\n${digest.text}`);
  } else {
    await sendSesEmail({
      from: process.env.SES_FROM_EMAIL, to: process.env.STATS_EMAIL_TO,
      subject: digest.subject, text: digest.text,
    });
    console.log(stats.allFailed
      ? `Aviso de fallo ${date} enviado a STATS_EMAIL_TO.`
      : `Resumen ${date} enviado a STATS_EMAIL_TO (${stats.failures.length} consulta(s) fallida(s)).`);
  }
  if (stats.allFailed) {
    console.error('Todas las consultas a GoatCounter fallaron.');
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
