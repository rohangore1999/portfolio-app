// Exact recovery colors from WHOOP's published Brand & Design Guidelines.
export function recoveryShade(value) {
  if (!Number.isFinite(value)) return '#454545';
  const score = Math.max(0, Math.min(100, value));
  return score >= 67 ? '#16EC06' : score >= 34 ? '#FFDE00' : '#FF0026';
}
