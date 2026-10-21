import { test } from 'node:test';
import assert from 'node:assert/strict';
import { previousDayInBogota, dayRangeUtc, buildDigest, buildFailureEmail, fetchStats, gc } from './portfolio-digest.mjs';

test('ayer en Bogota a las 7am local', () => {
  // 2026-10-18T12:00:00Z = 7:00 Bogota -> ayer 2026-10-17
  assert.equal(previousDayInBogota(new Date('2026-10-18T12:00:00Z')), '2026-10-17');
});
test('rango del dia en UTC (Bogota UTC-5)', () => {
  assert.deepEqual(dayRangeUtc('2026-10-17'), {
    start: '2026-10-17T05:00:00.000Z', end: '2026-10-18T05:00:00.000Z',
  });
});
test('digest incluye total y secciones', () => {
  const d = buildDigest({ date: '2026-10-17', total: 3, pages: [{ name: '/portfolio/', count: 3 }] });
  assert.match(d.subject, /3 visitas/);
  assert.match(d.text, /\/portfolio\//);
});

const res = (status, body = {}) => ({ ok: status < 400, status, json: async () => body });

test('reintenta en 429 y luego responde', async () => {
  let calls = 0;
  const fetchImpl = async () => (++calls < 3 ? res(429) : res(200, { total: 5 }));
  const out = await gc('/stats/total', { code: 'x', token: 't', start: 'a', end: 'b', fetchImpl, delayMs: 0 });
  assert.equal(out.total, 5);
  assert.equal(calls, 3);
});
test('no reintenta en 401', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; return res(401); };
  await assert.rejects(gc('/stats/hits', { code: 'x', token: 't', start: 'a', end: 'b', fetchImpl, delayMs: 0 }), (e) => e.status === 401);
  assert.equal(calls, 1);
});
test('si falla una consulta, el resto llega y se avisa', async () => {
  const fetchImpl = async (url) =>
    url.includes('/stats/hits') ? res(401) : url.includes('/stats/total') ? res(200, { total: 7 }) : res(200, { stats: [] });
  const s = await fetchStats({ code: 'x', token: 't', date: '2026-10-20', fetchImpl, delayMs: 0 });
  assert.equal(s.allFailed, false);
  assert.equal(s.total, 7);
  const d = buildDigest(s);
  assert.match(d.subject, /7 visitas.*incompleto/);
  assert.match(d.text, /401: revisa el token de GoatCounter/);
  assert.match(d.text, /No disponible \(falló la consulta\)/);
});
test('si fallan todas, correo corto de fallo', async () => {
  const s = await fetchStats({ code: 'x', token: 't', date: '2026-10-20', fetchImpl: async () => res(401), delayMs: 0 });
  assert.equal(s.allFailed, true);
  const d = buildFailureEmail(s);
  assert.match(d.subject, /no se pudo generar/);
  assert.match(d.text, /\/stats\/total\): 401: revisa el token/);
});
