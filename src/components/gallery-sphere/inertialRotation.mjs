// Equivalent to the reference's 0.94 friction and 0.11 follow factor at 60 Hz.
// Rates are expressed per second so high-refresh-rate displays feel the same.
export const ROTATION_FRICTION = -60 * Math.log(0.94);
const FOLLOW_RATE = -60 * Math.log(0.89);
const MAX_SPEED = 2.4;

export function normalizeWheel(event, pageHeight) {
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pageHeight : 1;
  return {
    x: Number.isFinite(event.deltaX) ? event.deltaX * unit : 0,
    y: Number.isFinite(event.deltaY) ? event.deltaY * unit : 0,
  };
}

export function createInertialRotation() {
  let velocityX = 0;
  let velocityY = 0;
  let targetX = 0;
  let targetY = 0;
  let displayedX = 0;
  let displayedY = 0;
  const delta = { yaw: 0, pitch: 0 };

  return {
    addImpulse(x, y) {
      velocityX += x;
      velocityY += y;
      // Cap total angular speed without favouring an axis or dropping diagonals.
      const speed = Math.hypot(velocityX, velocityY);
      if (speed > MAX_SPEED) {
        velocityX *= MAX_SPEED / speed;
        velocityY *= MAX_SPEED / speed;
      }
    },
    step(dt) {
      if (dt <= 0) { delta.yaw = delta.pitch = 0; return delta; }
      const decay = Math.exp(-ROTATION_FRICTION * dt);
      const followDecay = Math.exp(-FOLLOW_RATE * dt);
      const follow = 1 - followDecay;
      // Exact integration of decaying velocity plus a target-following filter.
      // This avoids different acceleration/distance at 30, 60, and 120 fps.
      const momentumFollow = (follow - FOLLOW_RATE * (decay - followDecay) / (FOLLOW_RATE - ROTATION_FRICTION)) / ROTATION_FRICTION;
      delta.yaw = (targetX - displayedX) * follow + velocityX * momentumFollow;
      delta.pitch = (targetY - displayedY) * follow + velocityY * momentumFollow;
      displayedX += delta.yaw;
      displayedY += delta.pitch;
      targetX += velocityX * (1 - decay) / ROTATION_FRICTION;
      targetY += velocityY * (1 - decay) / ROTATION_FRICTION;
      velocityX *= decay;
      velocityY *= decay;
      return delta;
    },
    reset() {
      velocityX = velocityY = targetX = targetY = displayedX = displayedY = 0;
      delta.yaw = delta.pitch = 0;
    },
  };
}
