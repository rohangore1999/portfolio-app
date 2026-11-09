// Repeated names complete one pass in 18 seconds. Integrating the easing
// analytically keeps reversals consistent at 30, 60, and 120 Hz.
export function advanceHeroMarquee({ position, direction, targetDirection, width, deltaSeconds }) {
  if (!(width > 0) || !(deltaSeconds > 0)) return { position, direction };
  const duration = 18;
  const damping = 8;
  const decay = Math.exp(-damping * deltaSeconds);
  const travel = targetDirection * deltaSeconds + (direction - targetDirection) * (1 - decay) / damping;
  const next = position - width / duration * travel;
  return {
    position: ((next % width) + width) % width - width,
    direction: targetDirection + (direction - targetDirection) * decay,
  };
}
