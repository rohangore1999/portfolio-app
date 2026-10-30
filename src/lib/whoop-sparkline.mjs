// Each missing day starts a new segment so the chart never invents a reading.
export function sparklineGeometry(points = []) {
  const values = points.map(point => point.value).filter(value => Number.isFinite(value) && value > 0);
  if (!values.length) return [];
  const low = Math.min(...values), high = Math.max(...values);
  const padding = Math.max((high - low) * 0.2, 1);
  const minimum = low - padding, range = high - low + padding * 2;
  const segments = [];
  let current = [];
  points.forEach((point, index) => {
    if (!Number.isFinite(point.value) || point.value <= 0) {
      if (current.length) segments.push(current);
      current = [];
      return;
    }
    current.push({ x: 4 + index / Math.max(1, points.length - 1) * 192, y: 40 - (point.value - minimum) / range * 36 });
  });
  if (current.length) segments.push(current);
  return segments;
}
