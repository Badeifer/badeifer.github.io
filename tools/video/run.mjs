/* Starts one run of the Dispatch video agent.

     node run.mjs                         latest article without a video
     node run.mjs <slug>                  that article
     node run.mjs --wait ...              stay until the run ends, print its final message, exit 1 on FAILED or a crash
     node run.mjs --wait --publish f.tgz  also download the agent's publish.tar.gz to f.tgz (the site's workflow unpacks it)

   The agent has no write access to anything: it hands back an archive and a job with the site's own token publishes it.
   Keys: ANTHROPIC_API_KEY, and GH_TOKEN (any token that can read Badeifer/badeifer.github.io) from the environment, or on
   Cade's PC from %LOCALAPPDATA%\TextAgent\keys.json (anthropicApiKey, githubToken).
   A copy of this file and state.json lives in the site repo at tools/video/ (setup.mjs refreshes it). */
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const args = process.argv.slice(2);
const WAIT = args.includes('--wait');
const pi = args.indexOf('--publish');
const PUBLISH = pi >= 0 ? args[pi + 1] : null;
const slug = args.find((a, i) => !a.startsWith('--') && i !== pi + 1) || 'latest';
const BUDGET_CENTS = '800'; /* $8 per run at list price; the API takes cents as an integer string */
const TIMEOUT_MS = 40 * 60 * 1000;
const BETAS = ['managed-agents-2026-04-01', 'files-api-2025-04-14'];

const state = JSON.parse(fs.readFileSync(path.join(HERE, 'state.json'), 'utf8'));
let local = {};
try { local = JSON.parse(fs.readFileSync(path.join(process.env.LOCALAPPDATA || '', 'TextAgent', 'keys.json'), 'utf8')); } catch { /* CI uses the environment */ }
const apiKey = (process.env.ANTHROPIC_API_KEY || local.anthropicApiKey || '').trim();
const gh = (process.env.GH_TOKEN || local.githubToken || '').trim();
if (!apiKey || !gh) throw new Error('need ANTHROPIC_API_KEY and GH_TOKEN');
const A = new Anthropic({ apiKey });

const resources = Object.values(state.files).map((f) => ({ type: 'file', file_id: f.id, mount_path: f.mount }));
resources.push({ type: 'github_repository', url: 'https://github.com/Badeifer/badeifer.github.io', authorization_token: gh, mount_path: '/workspace/site' });

const agent = await A.beta.agents.retrieve(state.agent); /* always the newest version of the brief */
const session = await A.beta.sessions.create({
  agent: { type: 'agent', id: state.agent, version: agent.version },
  environment_id: state.environment,
  resources,
  title: 'Dispatch video: ' + slug,
  metadata: { project: 'video-explainer', slug },
  budget: { type: 'limit', max_list_cost: { amount: BUDGET_CENTS, currency: 'USD' } }
});
console.log('session ' + session.id);
await A.beta.sessions.events.send(session.id, { events: [{ type: 'user.message', content: [{ type: 'text', text: slug === 'latest' ? 'Make the video for the latest article without one.' : `Make the video for the article with slug ${slug}.` }] }] });
if (!WAIT) process.exit(0);

const t0 = Date.now();
let status = '';
while (Date.now() - t0 < TIMEOUT_MS) {
  await new Promise((r) => setTimeout(r, 15000));
  const s = await A.beta.sessions.retrieve(session.id);
  status = s.status;
  if (status === 'idle' || status === 'terminated') break;
}
let last = '';
for await (const ev of A.beta.sessions.events.list(session.id, { limit: 200 })) {
  if (ev.type === 'agent.message') last = (ev.content || []).map((c) => c.text || '').join('');
}
console.log(`status ${status} after ${Math.round((Date.now() - t0) / 60000)} min\n${last}`);
const ok = status === 'idle' && /^\s*OK\b/.test(last);
if (ok && PUBLISH) {
  let f;
  for (let i = 0; i < 18 && !f; i++) { /* the session's output files can show up a few seconds after it goes idle */
    const page = await A.beta.files.list({ scope_id: session.id, limit: 100, betas: BETAS });
    f = page.data.find((x) => x.filename === 'publish.tar.gz' && x.downloadable);
    if (!f) await new Promise((r) => setTimeout(r, 10000));
  }
  if (!f) { console.log('no publish.tar.gz in the session outputs'); process.exit(1); }
  const r = await A.beta.files.download(f.id, { betas: BETAS });
  fs.writeFileSync(PUBLISH, Buffer.from(await r.arrayBuffer()));
  console.log(`saved ${PUBLISH} (${f.size_bytes} bytes)`);
}
process.exit(ok ? 0 : 1);
