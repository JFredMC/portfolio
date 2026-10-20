import { test } from 'node:test';
import assert from 'node:assert/strict';
import { previousDayInBogota, dayRangeUtc, buildDigest } from './portfolio-digest.mjs';

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
