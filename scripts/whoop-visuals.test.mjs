import test from 'node:test';
import assert from 'node:assert/strict';
import { recoveryShade } from '../src/lib/whoop-visuals.mjs';

test('recovery shades distinguish missing data from a recorded zero', () => {
  assert.equal(recoveryShade(null), '#454545');
  assert.equal(recoveryShade(NaN), '#454545');
  assert.notEqual(recoveryShade(0), recoveryShade(null));
});
test('recovery colors match WHOOP exactly at each band boundary', () => {
  for (const score of [0, 1, 33]) assert.equal(recoveryShade(score), '#FF0026');
  for (const score of [34, 50, 66]) assert.equal(recoveryShade(score), '#FFDE00');
  for (const score of [67, 84, 100]) assert.equal(recoveryShade(score), '#16EC06');
});
test('out-of-range recovery values clamp to the percentage scale', () => {
  assert.equal(recoveryShade(-1), recoveryShade(0));
  assert.equal(recoveryShade(101), recoveryShade(100));
});
