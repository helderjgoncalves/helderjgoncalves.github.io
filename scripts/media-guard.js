// Cloudflare Worker that keeps the clips' R2 reads inside the free tier.
// Not part of the site build: paste it into a Worker in the Cloudflare
// dashboard and give it a Cron Trigger (every 10 minutes: `*/10 * * * *`).
// It has no route; disable its workers.dev URL too.
//
// The clips are served straight from the R2 bucket `videos` on its custom
// domain, media.hgoncalves.uk, behind Cloudflare's cache. R2 has no spending
// cap, so on each run this Worker adds up the account's Class B operations
// (reads) for the current billing period and turns on the zone's
// "media kill switch" WAF rule once they pass LIMIT, which blocks every
// request to the media host. When a new period starts the count drops below
// LIMIT and the next run turns the rule off again, so a manual block is
// undone too: disable this Worker's trigger to keep the rule on by hand.
//
// It is a soft cap: analytics lag a few minutes and the check runs every ten,
// so a burst can overshoot. Past the free tier, reads cost $0.36 a million.
//
// Variables (Settings → Variables and Secrets):
//   ACCOUNT_ID   the Cloudflare account id
//   ZONE_ID      the hgoncalves.uk zone id
//   BILLING_DAY  optional, the day of the month the billing period starts (default 1)
//   CF_API_TOKEN secret: an API token with Account Analytics: Read and
//                Zone WAF: Edit on hgoncalves.uk, nothing else

const API = 'https://api.cloudflare.com/client/v4';

const FREE_CLASS_B = 10_000_000;
const LIMIT = 0.9 * FREE_CLASS_B;

// Must match the WAF custom rule's description exactly.
const KILL_SWITCH = 'media kill switch';

// R2's Class B operations, as named by the analytics dataset.
const CLASS_B = new Set([
  'HeadBucket',
  'HeadObject',
  'GetObject',
  'UsageSummary',
  'GetBucketEncryption',
  'GetBucketLocation',
  'GetBucketCors',
  'GetBucketLifecycleConfiguration',
]);

// The start of the current billing period, in UTC. A BILLING_DAY past the end
// of a short month falls on that month's last day.
function periodStart(now, billingDay) {
  const startIn = (year, month) => {
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return new Date(Date.UTC(year, month, Math.min(billingDay, lastDay)));
  };
  const thisMonth = startIn(now.getUTCFullYear(), now.getUTCMonth());
  return thisMonth <= now ? thisMonth : startIn(now.getUTCFullYear(), now.getUTCMonth() - 1);
}

async function api(env, path, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${env.CF_API_TOKEN}`, 'Content-Type': 'application/json' },
  });
  const body = await response.json();
  if (!response.ok || body.success === false || body.errors?.length) {
    throw new Error(`${init.method ?? 'GET'} ${path}: ${response.status} ${JSON.stringify(body.errors)}`);
  }
  return body;
}

async function classBReads(env, start, end) {
  const query = `query ($account: string!, $start: Time!, $end: Time!) {
    viewer {
      accounts(filter: { accountTag: $account }) {
        r2OperationsAdaptiveGroups(limit: 1000, filter: { datetime_geq: $start, datetime_leq: $end }) {
          sum { requests }
          dimensions { actionType }
        }
      }
    }
  }`;
  const body = await api(env, '/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables: { account: env.ACCOUNT_ID, start: start.toISOString(), end: end.toISOString() },
    }),
  });
  const groups = body.data?.viewer?.accounts?.[0]?.r2OperationsAdaptiveGroups;
  if (!groups) throw new Error(`No R2 analytics in ${JSON.stringify(body)}`);
  return groups
    .filter((group) => CLASS_B.has(group.dimensions.actionType))
    .reduce((total, group) => total + group.sum.requests, 0);
}

async function killSwitch(env) {
  const { result: ruleset } = await api(
    env,
    `/zones/${env.ZONE_ID}/rulesets/phases/http_request_firewall_custom/entrypoint`,
  );
  const rule = ruleset.rules?.find((candidate) => candidate.description === KILL_SWITCH);
  if (!rule) throw new Error(`No WAF custom rule described "${KILL_SWITCH}"`);
  return { rulesetId: ruleset.id, rule };
}

async function setKillSwitch(env, { rulesetId, rule }, enabled) {
  const { id, action, expression, description, action_parameters } = rule;
  await api(env, `/zones/${env.ZONE_ID}/rulesets/${rulesetId}/rules/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action, expression, description, action_parameters, enabled }),
  });
}

async function check(env) {
  const now = new Date();
  const start = periodStart(now, Number(env.BILLING_DAY ?? 1) || 1);
  const reads = await classBReads(env, start, now);
  const target = await killSwitch(env);
  const block = reads >= LIMIT;
  const share = ((reads / FREE_CLASS_B) * 100).toFixed(1);
  console.log(`Class B reads since ${start.toISOString()}: ${reads} (${share}% of the free tier)`);
  if ((target.rule.enabled ?? true) === block) return;
  await setKillSwitch(env, target, block);
  console.log(block ? 'Kill switch on: media host blocked' : 'Kill switch off: media host open');
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(check(env));
  },
};
