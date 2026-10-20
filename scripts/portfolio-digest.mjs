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

export function buildDigest({ date, total, pages = [], refs = [], countries = [], browsers = [] }) {
  const list = (items, empty) =>
    items.length ? items.slice(0, 5).map((i) => `- ${i.name}: ${i.count}`).join('\n') : `- ${empty}`;
  const text = [
    `Visitas a tu portfolio — ${date} (America/Bogota)`,
    '',
    `Páginas vistas / visitas: ${total}`,
    '',
    'Secciones y páginas más vistas:',
    list(pages, 'Sin datos'),
    '',
    'Desde dónde llegaron:',
    list(refs, 'Sin datos (puede ser tráfico directo)'),
    '',
    'Países:',
    list(countries, 'Sin datos'),
    '',
    'Navegadores:',
    list(browsers, 'Sin datos'),
    '',
    'Panel completo: https://' + (process.env.GOATCOUNTER_SITE_CODE || 'jfredmc') + '.goatcounter.com',
    'Nota: GoatCounter no guarda IPs ni usa cookies; “quién” es país/referente/dispositivo agregado.',
  ].join('\n');
  return { subject: `Portfolio: ${total} visitas el ${date}`, text };
}

async function gc(path, { code, token, start, end }) {
  // /stats/total no acepta `limit` (responde 400); solo se envía a los listados.
  const limit = path === '/stats/total' ? '' : '&limit=10';
  const url = `https://${code}.goatcounter.com/api/v0${path}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}${limit}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`GoatCounter ${path} respondió ${res.status}`);
  return res.json();
}

const names = (json, key) =>
  (json?.[key] ?? json?.stats ?? json?.hits ?? []).map((x) => ({
    name: x.name ?? x.path ?? x.id ?? '—',
    count: x.count ?? 0,
  }));

export async function fetchStats({ code, token, date }) {
  const { start, end } = dayRangeUtc(date);
  const [total, hits, refs, locations, browsers] = await Promise.all([
    gc('/stats/total', { code, token, start, end }),
    gc('/stats/hits', { code, token, start, end }),
    gc('/stats/toprefs', { code, token, start, end }).catch(() => ({})),
    gc('/stats/locations', { code, token, start, end }).catch(() => ({})),
    gc('/stats/browsers', { code, token, start, end }).catch(() => ({})),
  ]);
  return {
    date,
    total: total?.total ?? total?.total_events ?? 0,
    pages: names(hits, 'hits'),
    refs: names(refs, 'refs'),
    countries: names(locations, 'stats'),
    browsers: names(browsers, 'stats'),
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
  const digest = buildDigest(stats);
  if (args.has('--dry-run')) {
    console.log(`Subject: ${digest.subject}\n\n${digest.text}`);
    return;
  }
  await sendSesEmail({
    from: process.env.SES_FROM_EMAIL, to: process.env.STATS_EMAIL_TO,
    subject: digest.subject, text: digest.text,
  });
  console.log(`Resumen ${date} enviado a STATS_EMAIL_TO (${stats.total} visitas).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
