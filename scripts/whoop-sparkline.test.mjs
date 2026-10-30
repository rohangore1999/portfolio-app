import test from 'node:test';
import assert from 'node:assert/strict';
import { sparklineGeometry } from '../src/lib/whoop-sparkline.mjs';

test('missing days break the sparkline without compressing the time axis', () => {
  const segments = sparklineGeometry([52, 54, null, 56, null, 50].map(value => ({ value })));
  assert.deepEqual(segments.map(segment => segment.length), [2, 1, 1]);
  assert.equal(segments[0][0].x, 4);
  assert.equal(segments.at(-1)[0].x, 196);
  assert.ok(segments[1][0].x > segments[0][1].x);
});
test('flat, empty and single-reading series have finite chart coordinates', () => {
  assert.deepEqual(sparklineGeometry([{value:null}]), []);
  for (const values of [[50], [50,50,50]]) {
    const segments = sparklineGeometry(values.map(value=>({value})));
    assert.ok(segments.flat().every(point=>Number.isFinite(point.x)&&Number.isFinite(point.y)));
    assert.ok(segments.flat().every(point=>point.y===22));
  }
});
