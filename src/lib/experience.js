// Career start: March 2021. Only completed years are displayed.
export function getYearsOfExperience(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
  }).formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year").value);
  const month = Number(parts.find((part) => part.type === "month").value);
  return Math.max(0, year - 2021 - (month < 3 ? 1 : 0));
}
