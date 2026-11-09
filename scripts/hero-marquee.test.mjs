import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceHeroMarquee } from '../src/lib/hero-marquee.mjs';

function simulate(fps, seconds, targetDirection, start = { position: -100, direction: 1 }) {
  let state = start;
  for (let frame = 0; frame < fps * seconds; frame++) {
    state = advanceHeroMarquee({ ...state, targetDirection, width: 900, deltaSeconds: 1 / fps });
    assert.ok(state.position >= -900 && state.position <= 0);
  }
  return state;
}

test('a full 18-second pass wraps seamlessly and keeps moving in either direction', () => {
  for (const direction of [1, -1]) {
    const start = { position: -100, direction };
    const end = simulate(60, 18, direction, start);
    assert.ok(Math.abs(end.position - start.position) < 1e-8);
    const after = simulate(60, 1, direction, end);
    assert.ok(Math.abs(after.position - (-100 - direction * 50)) < 1e-8);
  }
});

test('scroll reversal eases through zero instead of jumping to reverse speed', () => {
  const first = advanceHeroMarquee({ position: -100, direction: 1, targetDirection: -1, width: 900, deltaSeconds: 1 / 60 });
  assert.ok(first.direction > 0 && first.direction < 1);
  assert.ok(first.position < -100);
  const end = simulate(60, 1, -1, first);
  assert.ok(end.direction < -0.99);
  assert.ok(end.position > first.position);
});

test('reversal distance and final speed agree at 30, 60, and 120 Hz', () => {
  const reference = simulate(60, 2, -1);
  for (const fps of [30, 120]) {
    const actual = simulate(fps, 2, -1);
    assert.ok(Math.abs(actual.position - reference.position) < 1e-8);
    assert.ok(Math.abs(actual.direction - reference.direction) < 1e-10);
  }
});

test('a hidden unmeasured name or zero-time resume leaves the phase unchanged', () => {
  for (const options of [{ width: 0, deltaSeconds: 1 / 60 }, { width: 900, deltaSeconds: 0 }]) {
    assert.deepEqual(advanceHeroMarquee({ position: -100, direction: -1, targetDirection: 1, ...options }), { position: -100, direction: -1 });
  }
});
