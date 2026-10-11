import { configuration, requestTokens, tokenStore, WHOOP_RESOURCES } from "./whoop.mjs";

export function dayKey(value) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

export function sleepHours(record) {
  const stages = record?.score?.stage_summary;
  if (!stages) return null;
  const values = [stages.total_light_sleep_time_milli, stages.total_slow_wave_sleep_time_milli, stages.total_rem_sleep_time_milli];
  return values.every(Number.isFinite) ? values.reduce((total, value) => total + value, 0) / 3600000 : null;
}

export function summarizeWhoop(records, now = new Date()) {
  const sleeps = records.sleep.filter(item => !item.nap && item.score_state === "SCORED").sort((a, b) => new Date(b.end) - new Date(a.end));
  const cycleDays = new Map();
  for (const sleep of records.sleep.filter(item => !item.nap && item.end).sort((a, b) => new Date(b.end) - new Date(a.end))) {
    if (!cycleDays.has(sleep.cycle_id)) cycleDays.set(sleep.cycle_id, dayKey(sleep.end));
  }
  const sleepByDay = new Map();
  const recoveryByDay = new Map();
  for (const sleep of sleeps) {
    const key = dayKey(sleep.end);
    if (sleepByDay.has(key)) continue;
    sleepByDay.set(key, sleepHours(sleep));
    const recovery = records.recovery.find(item => item.cycle_id === sleep.cycle_id && item.score_state === "SCORED");
    recoveryByDay.set(key, recovery?.score?.recovery_score ?? null);
  }
  const strainByDay = new Map();
  const coverage = new Set();
  const cycles = [...records.cycles].sort((a, b) => new Date(b.start) - new Date(a.start));
  for (const item of cycles) {
    // A cycle begins with sleep; its waking date labels the day, not bedtime.
    const key = cycleDays.get(item.id);
    if (!key || new Date(item.start) > now) continue;
    coverage.add(key);
    const complete = item.end && new Date(item.end) <= now;
    if ((complete || !item.end) && item.score_state === "SCORED" && Number.isFinite(item.score?.strain) && !strainByDay.has(key)) strainByDay.set(key, { value: item.score.strain, ongoing: !complete });
  }
  const workouts = records.workouts.filter(item => item.score_state === "SCORED");
  const days = Array.from({ length: 30 }, (_, index) => {
    const key = dayKey(new Date(now.getTime() - (29 - index) * 86400000));
    const activities = workouts.filter(item => dayKey(item.start) === key).map(item => ({
      name: item.sport_name || "Workout",
      minutes: Math.max(0, Math.round((new Date(item.end) - new Date(item.start)) / 60000)),
    }));
    return { date: key, tracked: coverage.has(key) || activities.length > 0, activities };
  });
  const sleepTrend = days.map(day => ({ date: day.date, value: sleepByDay.get(day.date) ?? null }));
  const strainTrend = days.map(day => ({ date: day.date, value: strainByDay.get(day.date)?.value ?? null, ongoing: strainByDay.get(day.date)?.ongoing ?? false }));
  const sleepValues = sleepTrend.map(point => point.value).filter(Number.isFinite);
  const strainValues = strainTrend.filter(point => !point.ongoing).map(point => point.value).filter(Number.isFinite);
  const recoveryTrend = days.map(day => ({ date: day.date, value: recoveryByDay.get(day.date) ?? null }));
  const recoveryValues = recoveryTrend.map(point => point.value).filter(Number.isFinite);
  const average = values => values.length ? values.reduce((total, value) => total + value, 0) / values.length : null;
  return {
    syncedAt: now.toISOString(), periodStart: days[0].date, periodEnd: days.at(-1).date,
    sleep: average(sleepValues), recovery: average(recoveryValues), strain: average(strainValues),
    samples: { sleep: sleepValues.length, recovery: recoveryValues.length, strain: strainValues.length },
    sleepTrend, recoveryTrend, strainTrend,
    days, workoutDays: days.filter(day => day.activities.length).length,
    sessions: days.reduce((total, day) => total + day.activities.length, 0),
  };
}

async function collection(endpoint, accessToken, start, fetcher) {
  const records = [];
  let nextToken;
  for (let page = 0; page < 20; page++) {
    const url = new URL(`https://api.prod.whoop.com/developer/v2/${endpoint}`);
    url.search = new URLSearchParams({ limit: "25", start, ...(nextToken ? { nextToken } : {}) }).toString();
    const response = await fetcher(url, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error("whoop_fetch_failed");
    const data = await response.json();
    if (!Array.isArray(data.records)) throw new Error("invalid_whoop_data");
    records.push(...data.records);
    nextToken = data.next_token;
    if (!nextToken) return records;
  }
  throw new Error("whoop_pagination_limit");
}

export async function fetchWhoopPreview({ fetcher = fetch, store = tokenStore(), config = configuration(), now = new Date() } = {}) {
  let tokens = await store.read();
  if (!tokens) throw new Error("not_connected");
  if (tokens.expires_at <= now.getTime() + 60000) {
    tokens = await requestTokens(config, { grant_type: "refresh_token", refresh_token: tokens.refresh_token, scope: "offline" }, fetcher);
    await store.save(tokens);
  }
  const start = new Date(now.getTime() - 32 * 86400000).toISOString();
  const entries = await Promise.all(Object.entries(WHOOP_RESOURCES).map(async ([name, endpoint]) => [name, await collection(endpoint, tokens.access_token, start, fetcher)]));
  return summarizeWhoop(Object.fromEntries(entries), now);
}
