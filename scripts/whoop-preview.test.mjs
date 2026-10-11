import test from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, sleepHours, summarizeWhoop, fetchWhoopPreview } from '../src/lib/whoop-preview.mjs';
const now = new Date('2026-10-11T05:00:00Z');
const sleep = { cycle_id: 42, start: '2026-10-10T17:00:00Z', end: '2026-10-11T01:00:00Z', nap: false, score_state: 'SCORED', score: { stage_summary: { total_light_sleep_time_milli: 14400000, total_slow_wave_sleep_time_milli: 7200000, total_rem_sleep_time_milli: 3600000, total_awake_time_milli: 3600000 } } };
const records = { sleep: [sleep], recovery: [{ cycle_id: 42, score_state: 'SCORED', score: { recovery_score: 60 } }], cycles: [{ id: 42, start: '2026-10-10T01:00:00Z', end: '2026-10-11T01:00:00Z', score_state: 'SCORED', score: { strain: 4 } }], workouts: [] };
test('sleep duration excludes awake time and requires complete stage totals', () => {
  assert.equal(sleepHours(sleep), 7);
  assert.equal(sleepHours({}), null);
});
test('monthly averages exclude naps and pair recovery with its sleep', () => {
  const result = summarizeWhoop({ ...records, sleep: [{ ...sleep, nap: true, end: '2026-10-11T04:00:00Z' }, sleep], recovery: [{ cycle_id: 99, score_state: 'SCORED', score: { recovery_score: 99 } }, ...records.recovery] }, now);
  assert.equal(result.sleep, 7);
  assert.equal(result.recovery, 60);
  assert.equal(result.strain, 4);
  assert.equal(result.periodEnd, '2026-10-11');
  assert.equal(result.periodStart, '2026-09-12');
  assert.equal(result.sleepTrend.length, 30);
  assert.equal(result.recoveryTrend.length, 30);
  assert.equal(result.recoveryTrend.at(-1).value, 60);
});
test('activity uses IST dates and distinguishes missing data from no workouts', () => {
  assert.equal(dayKey('2026-10-10T20:00:00Z'), '2026-10-11');
  const workout = { start: '2026-10-10T20:00:00Z', end: '2026-10-10T20:45:00Z', sport_name: 'running', score_state: 'SCORED' };
  const result = summarizeWhoop({ ...records, workouts: [workout] }, now);
  assert.equal(result.days.length, 30);
  assert.equal(result.days.at(-1).activities[0].minutes, 45);
  assert.equal(result.workoutDays, 1);
  assert.equal(result.days[0].tracked, false);
  assert.equal(summarizeWhoop(records, now).days.at(-1).tracked, true);
  assert.equal(summarizeWhoop(records, now).days.at(-1).activities.length, 0);
});
test('collections follow pagination and public summary excludes raw records and tokens', async () => {
  let sleepCalls = 0;
  const result = await fetchWhoopPreview({ now, config: {}, store: { read: async () => ({ access_token: 'private-token', expires_at: now.getTime() + 3600000 }) }, fetcher: async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer private-token');
    if (url.pathname.endsWith('/sleep')) {
      sleepCalls++;
      if (!url.searchParams.has('nextToken')) return Response.json({ records: [sleep], next_token: 'second-page' });
      assert.equal(url.searchParams.get('nextToken'), 'second-page');
      return Response.json({ records: [] });
    }
    const name = url.pathname.endsWith('/cycle') ? 'cycles' : url.pathname.endsWith('/recovery') ? 'recovery' : 'workouts';
    return Response.json({ records: records[name] });
  } });
  assert.equal(sleepCalls, 2);
  assert.equal(result.sleep, 7);
  assert.equal(JSON.stringify(result).includes('private-token'), false);
  assert.equal(JSON.stringify(result).includes('stage_summary'), false);
});


test('monthly averages use recorded samples only and exclude unfinished cycles and out-of-window records', () => {
  const earlierSleep = { ...sleep, cycle_id: 43, end: '2026-10-10T01:00:00Z', score: { stage_summary: { total_light_sleep_time_milli: 10800000, total_slow_wave_sleep_time_milli: 3600000, total_rem_sleep_time_milli: 3600000 } } };
  const oldSleep = { ...sleep, cycle_id: 44, end: '2026-09-01T01:00:00Z' };
  const result = summarizeWhoop({ ...records, sleep: [sleep, earlierSleep, oldSleep], recovery: [...records.recovery, { cycle_id: 43, score_state: 'SCORED', score: { recovery_score: 80 } }], cycles: [...records.cycles, { id: 43, start: '2026-10-09T01:00:00Z', end: '2026-10-10T01:00:00Z', score_state: 'SCORED', score: { strain: 12 } }, { id: 45, start: '2026-10-11T01:00:00Z', end: null, score_state: 'SCORED', score: { strain: 1 } }] }, now);
  assert.equal(result.sleep, 6);
  assert.equal(result.recovery, 70);
  assert.equal(result.strain, 8);
  assert.deepEqual(result.samples, { sleep: 2, recovery: 2, strain: 2 });
  assert.equal(result.strainTrend.at(-1).value, 4);
});


test('strain follows the main sleep waking date and keeps ongoing values out of averages', () => {
  const yesterday = { ...sleep, cycle_id: 43, start: '2026-10-09T17:00:00Z', end: '2026-10-10T01:00:00Z' };
  const result = summarizeWhoop({ ...records, sleep: [sleep, yesterday, { ...sleep, cycle_id: 43, nap: true, end: '2026-10-11T03:00:00Z' }], cycles: [
    { id: 43, start: yesterday.start, end: sleep.start, score_state: 'SCORED', score: { strain: 17.85 } },
    { id: 42, start: sleep.start, end: null, score_state: 'SCORED', score: { strain: 4.06 } },
    { id: 99, start: sleep.start, end: sleep.end, score_state: 'SCORED', score: { strain: 20 } },
  ] }, now);
  assert.deepEqual(result.strainTrend.at(-2), {date: '2026-10-10', value: 17.85, ongoing: false});
  assert.deepEqual(result.strainTrend.at(-1), {date: '2026-10-11', value: 4.06, ongoing: true});
  assert.equal(result.strain, 17.85);
  assert.equal(result.samples.strain, 1);
});
