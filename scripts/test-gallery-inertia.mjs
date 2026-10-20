import assert from "node:assert/strict";
import test from "node:test";
import { createInertialRotation, normalizeWheel } from "../src/components/gallery-sphere/inertialRotation.mjs";

function advance(controller, seconds, fps = 60) {
  const total = { yaw: 0, pitch: 0 };
  for (let frame = 0; frame < seconds * fps; frame++) {
    const delta = controller.step(1 / fps);
    total.yaw += delta.yaw;
    total.pitch += delta.pitch;
  }
  return total;
}

test("pixel, line, and page wheel units produce equivalent input", () => {
  const pixels = normalizeWheel({ deltaX: 16, deltaY: -32, deltaMode: 0 }, 800);
  assert.deepEqual(normalizeWheel({ deltaX: 1, deltaY: -2, deltaMode: 1 }, 800), pixels);
  assert.deepEqual(normalizeWheel({ deltaX: 0.02, deltaY: -0.04, deltaMode: 2 }, 800), pixels);
});

test("vertical and mixed-direction gestures continue on both axes", () => {
  const motion = createInertialRotation();
  motion.addImpulse(0, 0.5);
  assert.ok(motion.step(1 / 60).pitch > 0);
  for (const [x, y] of [[0.08, 0.1], [0.1, 0.08], [-0.08, 0.1]]) {
    motion.addImpulse(x, y);
    assert.ok(motion.step(1 / 60).pitch > 0);
  }
});

test("successive impulses accumulate rather than overwrite momentum", () => {
  const one = createInertialRotation();
  const two = createInertialRotation();
  one.addImpulse(0.25, 0.1);
  two.addImpulse(0.25, 0.1);
  two.addImpulse(0.25, 0.1);
  assert.ok(advance(two, 1).yaw > advance(one, 1).yaw * 1.9);
});

test("a zero-delta tail does not cancel the gesture's remaining momentum", () => {
  const motion = createInertialRotation();
  motion.addImpulse(0.5, 0.5);
  advance(motion, 0.2);
  motion.addImpulse(0, 0);
  const coast = advance(motion, 0.5);
  assert.ok(coast.yaw > 0.01 && coast.pitch > 0.01);
});

test("motion eases in, coasts after input stops, and settles", () => {
  const motion = createInertialRotation();
  motion.addImpulse(1, 0);
  const first = motion.step(1 / 60).yaw;
  let peak = first;
  for (let i = 0; i < 15; i++) peak = Math.max(peak, motion.step(1 / 60).yaw);
  assert.ok(peak > first * 2, "the visible response should build instead of jumping immediately");
  assert.ok(advance(motion, 0.5).yaw > 0.01, "coasting continues after the initial response");
  advance(motion, 8);
  assert.ok(Math.abs(motion.step(1 / 60).yaw) < 1e-9, "motion eventually comes to rest");
});

test("direction reversal stays continuous and eventually follows the new direction", () => {
  const motion = createInertialRotation();
  motion.addImpulse(1, 0);
  advance(motion, 0.2);
  motion.addImpulse(-2, 0);
  assert.ok(Number.isFinite(motion.step(1 / 60).yaw));
  assert.ok(advance(motion, 1).yaw < 0);
});

test("30, 60, and 120 fps produce the same rotation distance", () => {
  const results = [30, 60, 120].map(fps => {
    const motion = createInertialRotation();
    motion.addImpulse(1.2, -0.8);
    return advance(motion, 2, fps);
  });
  for (const result of results.slice(1)) {
    assert.ok(Math.abs(result.yaw - results[0].yaw) < 1e-10);
    assert.ok(Math.abs(result.pitch - results[0].pitch) < 1e-10);
  }
});

test("speed limiting preserves the direction of diagonal input", () => {
  const motion = createInertialRotation();
  motion.addImpulse(300, 400);
  const total = advance(motion, 1);
  assert.ok(Math.abs(total.yaw / total.pitch - 0.75) < 1e-10);
  assert.ok(Math.hypot(total.yaw, total.pitch) < 1);
});

test("opening a photo can clear all pending rotation", () => {
  const motion = createInertialRotation();
  motion.addImpulse(2, -1);
  advance(motion, 0.2);
  motion.reset();
  assert.deepEqual(motion.step(1 / 60), { yaw: 0, pitch: 0 });
});
