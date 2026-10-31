// Keeps private details out of this public repo: the owner's real name and email, and live keys.
// The names are stored as hashes and matches are never printed, so neither this file nor a public log can leak them.
//
//   node tools/check-private.mjs            every text file in the repo
//   node tools/check-private.mjs --file f   one file, such as a commit message
//   git log | node tools/check-private.mjs --stdin
//
// build.mjs, the hooks in .githooks and .github/workflows/privacy-check.yml all run it.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const hash = (word) => createHash('sha256').update(word).digest('hex').slice(0, 16);
const PRIVATE = new Set(['d10922fe8ed49b2c', 'e675137ec2f19377', '3818a41fee499809', 'c9a79f1d889a8c28', '632a717c8a4e49c5']);
// A journalist who shares the first name and may be quoted in Dispatch: skip when the next word hashes to this.
const SOMEONE_ELSE = new Set(['1382dca91398a112']);
const KEYS = /sk-ant-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{36}|gho_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{40,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|-----BEGIN [A-Z ]*PRIVATE KEY/;

export function findPrivate(text) {
  const found = [];
  text.split('\n').forEach((line, i) => {
    const words = line.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    if (words.some((w, k) => PRIVATE.has(hash(w)) && !SOMEONE_ELSE.has(hash(words[k + 1] || '')))) found.push(`line ${i + 1}: real name or email`);
    if (KEYS.test(line)) found.push(`line ${i + 1}: a live key`);
  });
  return found;
}

export function scanRepo() {
  const found = [];
  // Tracked and new files; anything gitignored never leaves the machine.
  for (const path of execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { maxBuffer: 1 << 26 }).toString().split('\0')) {
    if (!path || !existsSync(path) || statSync(path).size > 2e6) continue;
    const bytes = readFileSync(path);
    if (bytes.subarray(0, 8000).includes(0)) continue; // images and video
    found.push(...findPrivate(bytes.toString('utf8')).map((f) => `${path} ${f}`));
  }
  return found;
}

export function report(found) {
  if (!found.length) return false;
  console.error(`Private details found, remove them before this goes public:\n  ${found.join('\n  ')}`);
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [mode, file] = process.argv.slice(2);
  const found = mode === '--file' ? findPrivate(readFileSync(file, 'utf8')) : mode === '--stdin' ? findPrivate(readFileSync(0, 'utf8')) : scanRepo();
  if (report(found)) process.exit(1);
  console.log('Privacy check passed');
}
