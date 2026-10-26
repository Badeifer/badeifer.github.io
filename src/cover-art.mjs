// Cover art for The Dispatch: a small pixel-art night scene per article, in the Moonlit Keep palette.
// Each topic has its own building (AI a crystal tower, AI tools a forge, skills a library, cyber a gatehouse,
// industry a windmill); the slug seeds everything else: where it stands, the moon, the stars, hills, trees and fireflies.
// Drawn at 176x88 and written as a PNG with no dependencies, so the daily cloud job can build it too.
import { deflateSync } from 'node:zlib';

export const COVER_W = 176, COVER_H = 88;

function rng(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');

const P = {
  sky: ['#06081a', '#0a0d25', '#0f1233', '#151942', '#1c2150'],
  star: '#ede6d3', star2: '#a9aecf', star3: '#5c66b3',
  moon: '#f2ead2', moonShade: '#cfc8b4', moonPit: '#aaa6b2',
  hillFar: '#161b42', hillFar2: '#1d2350', hillMid: '#0f1335', ground: '#0a0d27', groundSpeck: '#141939', path: '#20224a',
  tree: '#080b22', tree2: '#0e1230',
  out: '#07091b', s0: '#2a3166', s1: '#3a4382', s2: '#5560aa', s3: '#6f7ac4',
  r0: '#1a1531', r1: '#29214b', r2: '#3a2f66',
  w0: '#24191a', w1: '#3f2c25', w2: '#5a4031',
  smoke: '#3a3f6e', smoke2: '#4a4f80', cloth: '#a9a4bc', cloth2: '#8d89a6', cloud: '#1f2556', cloud2: '#283063'
};
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

function canvas() {
  const px = new Array(COVER_W * COVER_H).fill(null);
  const c = {
    px,
    set(x, y, col) { x = Math.round(x); y = Math.round(y); if (col && x >= 0 && y >= 0 && x < COVER_W && y < COVER_H) px[y * COVER_W + x] = col; },
    get(x, y) { return px[y * COVER_W + x]; },
    rect(x, y, w, h, col) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) c.set(x + i, y + j, col); },
    hline(x1, x2, y, col) { for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) c.set(x, y, col); },
    vline(x, y1, y2, col) { for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) c.set(x, y, col); },
    disc(cx, cy, r, col) { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) c.set(cx + x, cy + y, col); },
    line(x1, y1, x2, y2, col) { const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) || 1; for (let i = 0; i <= n; i++) c.set(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, col); },
    // A soft light as dithered rings: dense near the centre, sparse at the edge.
    glow(cx, cy, r, col) {
      for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
        const d = Math.sqrt(x * x + y * y) / r; if (d > 1) continue;
        const X = Math.round(cx + x), Y = Math.round(cy + y); if (X < 0 || Y < 0 || X >= COVER_W || Y >= COVER_H) continue;
        if ((1 - d) * 16 * 0.75 > BAYER[Y & 3][X & 3]) c.set(X, Y, col);
      }
    }
  };
  return c;
}

// One stone block with an outline, light on the moon side and a darker shadow side.
function block(c, x, y, w, h, lit, cols = [P.s0, P.s1, P.s2]) {
  c.rect(x, y, w, h, cols[1]);
  c.vline(lit < 0 ? x : x + w - 1, y, y + h - 1, cols[2]);
  c.vline(lit < 0 ? x + 1 : x + w - 2, y, y + h - 1, cols[2]);
  c.vline(lit < 0 ? x + w - 1 : x, y, y + h - 1, cols[0]);
  for (let j = 3; j < h; j += 4) for (let i = (j / 4) % 2 ? 1 : 3; i < w - 1; i += 5) c.set(x + i, y + j, cols[0]);
  c.hline(x - 1, x + w, y - 1, P.out); c.hline(x - 1, x + w, y + h, P.out); c.vline(x - 1, y, y + h - 1, P.out); c.vline(x + w, y, y + h - 1, P.out);
}
function battlements(c, x, y, w, lit) {
  block(c, x - 1, y - 3, w + 2, 3, lit);
  for (let i = 0; i < w + 2; i += 4) { c.rect(x - 1 + i, y - 6, 2, 3, lit < 0 && i < 2 ? P.s2 : P.s1); c.hline(x - 1 + i, x + i, y - 7, P.out); c.vline(x - 2 + i, y - 6, y - 4, P.out); c.vline(x + 1 + i, y - 6, y - 4, P.out); }
}
function archWindow(c, x, y, w, h, hue, dim) {
  c.rect(x, y + 1, w, h - 1, hue); c.hline(x + 1, x + w - 2, y, hue);
  if (w >= 3) c.vline(x + Math.floor(w / 2), y + 2, y + h - 1, dim);
  c.hline(x, x + w - 1, y + h, P.out);
}
function gable(c, x, y, w, rise, lit) {
  for (let j = 0; j <= rise; j++) {
    const inset = Math.round((rise - j) * (w / 2) / rise), x1 = x + inset, x2 = x + w - 1 - inset;
    c.hline(x1, x2, y + j, P.r1); c.set(x1, y + j, P.out); c.set(x2, y + j, P.out);
    if (j % 2 === 0 && j > 0) for (let i = x1 + 2; i < x2 - 1; i += 3) c.set(i, y + j, P.r0);
    c.set(lit < 0 ? x1 + 1 : x2 - 1, y + j, P.r2);
  }
  c.set(x + Math.floor(w / 2), y - 1, P.out);
}
function pine(c, x, base, h, col) {
  c.vline(x, base - 2, base, P.out);
  for (let j = 0; j < h; j++) { const half = Math.round((j / h) * (h / 2.6)) ; c.hline(x - half, x + half, base - 2 - h + j, j % 3 === 2 ? P.tree2 : col); }
}
function cottage(c, x, base, lit, hue, dim) {
  block(c, x, base - 8, 14, 8, lit);
  gable(c, x - 2, base - 15, 18, 6, lit);
  c.rect(x + 3, base - 6, 3, 3, hue); c.rect(x + 9, base - 6, 3, 6, P.w1); c.set(x + 10, base - 3, dim);
}

// ---------- the five buildings; each returns the door point so the path can lead to it ----------
function tower(c, cx, base, lit, hue, dim, bright) {
  const w = 16, h = 42, x = cx - w / 2, top = base - h;
  block(c, x, top, w, h, lit);
  battlements(c, x, top, w, lit);
  for (const wy of [top + 8, top + 20]) archWindow(c, cx - 1, wy, 3, 6, hue, dim);
  archWindow(c, cx - 3, base - 9, 6, 9, dim, P.out);
  // The crystal: a floating diamond with a halo and four rays.
  const gy = top - 16;
  c.glow(cx, gy, 13, dim);
  for (let i = 4; i < 11; i += 2) { c.set(cx, gy - 7 - i, dim); c.set(cx, gy + 7 + i - 4, dim); c.set(cx - 5 - i, gy, dim); c.set(cx + 5 + i, gy, dim); }
  for (let j = -7; j <= 7; j++) { const half = 4 - Math.abs(Math.round(j * 4 / 7)); c.hline(cx - half, cx + half, gy + j, hue); c.set(cx - half - 1, gy + j, P.out); c.set(cx + half + 1, gy + j, P.out); }
  c.set(cx, gy - 8, P.out); c.set(cx, gy + 8, P.out);
  for (let j = -5; j <= 1; j++) c.set(cx - 1 + (lit < 0 ? 0 : 2) - (j < -2 ? 0 : 0), gy + j, bright);
  c.vline(cx, gy - 5, gy + 5, mix(hue, bright, 0.5));
  return [cx, base];
}
function forge(c, cx, base, lit, hue, dim, bright, r) {
  const w = 42, x = cx - w / 2, wallTop = base - 20;
  block(c, x, wallTop, w, 20, lit, [P.s0, P.s1, P.s2]);
  for (let i = x + 1; i < x + w; i += 10) c.vline(i, wallTop, base - 1, P.w1);
  c.hline(x, x + w - 1, wallTop, P.w1); c.hline(x, x + w - 1, wallTop + 1, P.w0);
  // Chimney with smoke and sparks.
  const chx = lit < 0 ? x + w - 10 : x + 4;
  block(c, chx, wallTop - 22, 6, 12, lit);
  c.rect(chx - 1, wallTop - 24, 8, 2, P.s2); c.hline(chx - 2, chx + 7, wallTop - 25, P.out);
  gable(c, x - 3, wallTop - 15, w + 6, 14, lit);
  for (let i = 0; i < 3; i++) c.glow(chx + 3 + i * (lit < 0 ? -3 : 3), wallTop - 29 - i * 6, 3 + i, i ? P.smoke : P.smoke2);
  for (let i = 0; i < 6; i++) c.set(chx + 1 + r() * 5 + (r() - 0.5) * 6, wallTop - 27 - r() * 12, i % 2 ? hue : bright);
  // The open forge: a glowing arch with an anvil in front.
  const dx = lit < 0 ? x + 6 : x + w - 20;
  c.glow(dx + 7, base - 6, 14, dim);
  c.rect(dx, base - 13, 14, 13, dim); c.rect(dx + 2, base - 11, 10, 11, hue); c.rect(dx + 4, base - 8, 6, 8, bright);
  c.hline(dx + 1, dx + 12, base - 14, hue); c.hline(dx - 1, dx + 14, base - 15, P.out); c.vline(dx - 1, base - 14, base - 1, P.out); c.vline(dx + 14, base - 14, base - 1, P.out);
  c.hline(dx + 2, dx + 12, base - 6, P.out); c.hline(dx + 4, dx + 10, base - 5, P.out); c.rect(dx + 6, base - 4, 3, 4, P.out); c.hline(dx + 4, dx + 10, base - 1, P.out);
  // Window and a hanging sign with a cog.
  const wx = lit < 0 ? x + w - 13 : x + 8;
  c.rect(wx, base - 15, 6, 5, hue); c.vline(wx + 3, base - 15, base - 11, P.out); c.hline(wx, wx + 5, base - 13, P.out); c.hline(wx - 1, wx + 6, base - 10, P.out);
  const sx = lit < 0 ? x - 6 : x + w + 2;
  c.hline(sx, sx + 5, wallTop + 3, P.w1); c.vline(sx + 1, wallTop + 4, wallTop + 5, P.out); c.vline(sx + 4, wallTop + 4, wallTop + 5, P.out);
  c.rect(sx, wallTop + 6, 6, 6, P.w1); c.disc(sx + 3, wallTop + 9, 2, hue); c.set(sx + 3, wallTop + 9, P.w0);
  return [dx + 7, base];
}
function library(c, cx, base, lit, hue, dim, bright) {
  const w = 48, x = cx - w / 2, wallTop = base - 26;
  block(c, x, wallTop, w, 26, lit);
  gable(c, x - 3, wallTop - 12, w + 6, 11, lit);
  // Central gable with a rose window.
  block(c, cx - 9, wallTop - 14, 18, 14, lit);
  gable(c, cx - 11, wallTop - 25, 22, 10, lit);
  c.disc(cx, wallTop - 8, 5, P.out); c.disc(cx, wallTop - 8, 4, hue);
  for (let a = 0; a < 8; a++) c.line(cx, wallTop - 8, cx + Math.round(Math.cos(a * Math.PI / 4) * 4), wallTop - 8 + Math.round(Math.sin(a * Math.PI / 4) * 4), dim);
  c.set(cx, wallTop - 8, bright);
  for (const wx of [x + 4, x + 11, x + w - 15, x + w - 8]) archWindow(c, wx, wallTop + 6, 4, 11, hue, dim);
  archWindow(c, cx - 4, base - 13, 8, 13, dim, P.out);
  c.rect(cx - 3, base - 11, 6, 11, P.w1); c.vline(cx, base - 11, base - 1, P.w0);
  for (let i = 0; i < 3; i++) c.hline(cx - 7 - i * 2, cx + 6 + i * 2, base + i, i ? P.s1 : P.s2);
  // Lanterns at the door.
  for (const lx of [cx - 9, cx + 8]) { c.glow(lx, base - 12, 6, dim); c.rect(lx - 1, base - 13, 2, 3, bright); c.vline(lx, base - 10, base - 1, P.out); }
  return [cx, base + 2];
}
function gatehouse(c, cx, base, lit, hue, dim, bright) {
  const tw = 15, th = 42, gw = 24, gh = 30;
  const lx = cx - gw / 2 - tw, rx = cx + gw / 2;
  block(c, cx - gw / 2, base - gh, gw, gh, lit);
  battlements(c, cx - gw / 2, base - gh, gw, lit);
  for (const tx of [lx, rx]) {
    block(c, tx, base - th, tw, th, lit); battlements(c, tx, base - th, tw, lit);
    c.vline(tx + 7, base - th + 8, base - th + 13, P.out); c.vline(tx + 7, base - th + 20, base - th + 25, P.out);
  }
  // The gate: a lit arch behind the portcullis.
  const gx = cx - 7, gy = base - 20;
  c.rect(gx, gy + 2, 14, 18, dim); c.hline(gx + 2, gx + 11, gy, dim); c.hline(gx + 1, gx + 12, gy + 1, dim);
  c.rect(gx + 2, gy + 4, 10, 16, hue);
  for (let i = gx + 1; i < gx + 14; i += 3) c.vline(i, gy + 1, base - 1, P.out);
  for (let j = gy + 4; j < base; j += 4) c.hline(gx, gx + 13, j, P.out);
  c.hline(gx + 1, gx + 12, gy - 1, P.out); c.set(gx, gy, P.out); c.set(gx + 13, gy, P.out);
  // Shield with a keyhole above the gate.
  const sy = base - gh + 4;
  for (let j = 0; j < 9; j++) { const half = j < 5 ? 4 : 4 - (j - 4); c.hline(cx - half, cx + half, sy + j, hue); c.set(cx - half - 1, sy + j, P.out); c.set(cx + half + 1, sy + j, P.out); }
  c.hline(cx - 5, cx + 5, sy - 1, P.out); c.rect(cx - 1, sy + 2, 2, 2, P.out); c.vline(cx, sy + 4, sy + 6, P.out); c.set(cx - 1 + (lit < 0 ? 0 : 1), sy + 1, bright);
  // Torches either side.
  for (const t of [gx - 4, gx + 17]) { c.glow(t, gy + 3, 8, dim); c.rect(t, gy + 5, 1, 4, P.w1); c.rect(t - 1, gy + 2, 3, 3, hue); c.set(t, gy + 1, bright); c.set(t, gy + 2, bright); }
  return [cx, base];
}
function windmill(c, cx, base, lit, hue, dim, bright, r) {
  const h = 32, top = base - h;
  for (let j = 0; j < h; j++) {
    const half = Math.round(6 + j * 4 / h), x1 = cx - half, x2 = cx + half;
    c.hline(x1, x2, top + j, P.s1);
    c.set(lit < 0 ? x1 + 1 : x2 - 1, top + j, P.s2); c.set(lit < 0 ? x1 + 2 : x2 - 2, top + j, P.s2); c.set(lit < 0 ? x2 - 1 : x1 + 1, top + j, P.s0);
    if (j % 4 === 3) for (let i = x1 + 2 + (j % 8 === 3 ? 0 : 2); i < x2 - 1; i += 4) c.set(i, top + j, P.s0);
    c.set(x1 - 1, top + j, P.out); c.set(x2 + 1, top + j, P.out);
  }
  c.hline(cx - 11, cx + 11, base, P.out);
  for (let j = 0; j < 7; j++) { const half = Math.round(Math.sqrt(49 - (7 - j) * (7 - j)) * 1.1); c.hline(cx - half, cx + half, top - 7 + j, j < 2 ? P.r2 : P.r1); c.set(cx - half - 1, top - 7 + j, P.out); c.set(cx + half + 1, top - 7 + j, P.out); }
  c.hline(cx - 8, cx + 8, top, P.out);
  archWindow(c, cx - 2, top + 9, 4, 5, hue, dim);
  c.rect(cx - 3, base - 9, 6, 9, P.w1); c.rect(cx - 2, base - 8, 2, 3, dim);
  // Four lattice sails, turned by the slug.
  const hub = [cx, top + 2], a0 = r() * Math.PI / 2;
  for (let k = 0; k < 4; k++) {
    const a = a0 + k * Math.PI / 2, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
    for (let s = 3; s <= 26; s++) {
      c.set(hub[0] + dx * s, hub[1] + dy * s, P.w0);
      if (s < 8) continue;
      for (let q = 1; q <= 5; q++) {
        const col = q === 5 || s === 8 || s === 26 ? P.w1 : s % 6 === 2 ? P.cloth2 : P.cloth;
        c.set(hub[0] + dx * s + nx * q, hub[1] + dy * s + ny * q, col);
      }
    }
  }
  c.disc(hub[0], hub[1], 2, P.w1); c.set(hub[0], hub[1], P.out);
  return [cx, base];
}
const BUILD = { ai: tower, tools: forge, skills: library, cyber: gatehouse, industry: windmill };

// Small props that change from article to article.
function barrel(c, x, base) { c.rect(x, base - 5, 4, 5, P.w1); c.hline(x, x + 3, base - 4, P.w0); c.hline(x, x + 3, base - 2, P.w0); c.vline(x + 1, base - 5, base - 1, P.w2); c.hline(x - 1, x + 4, base - 6, P.out); c.vline(x - 1, base - 5, base - 1, P.out); c.vline(x + 4, base - 5, base - 1, P.out); }
function fence(c, x, base, n) { for (let i = 0; i < n; i++) c.vline(x + i * 3, base - 4, base - 1, P.w1); c.hline(x, x + (n - 1) * 3, base - 3, P.w0); }
function well(c, x, base, hue) { block(c, x, base - 4, 7, 4, 1); c.vline(x, base - 10, base - 5, P.w1); c.vline(x + 6, base - 10, base - 5, P.w1); c.hline(x - 1, x + 7, base - 11, P.r1); c.hline(x - 1, x + 7, base - 12, P.out); c.vline(x + 3, base - 10, base - 7, P.out); }
function lamppost(c, x, base, hue, dim, bright) { c.glow(x, base - 11, 6, dim); c.vline(x, base - 9, base - 1, P.out); c.rect(x - 1, base - 12, 3, 3, hue); c.set(x, base - 11, bright); c.hline(x - 1, x + 1, base - 13, P.out); }
const PROPS = [barrel, fence, well, lamppost];

export function drawCover(slug, topic, hue, deep) {
  const r = rng(slug), c = canvas();
  const dim = mix(hue, '#141833', 0.55), bright = mix(hue, '#ffffff', 0.55);
  const W = COVER_W, H = COVER_H, base = 70, horizon = 64;
  const side = r() < 0.5 ? -1 : 1;              // which side the building stands on
  const cx = Math.round(W / 2 + side * (12 + r() * 12));
  const moonX = Math.round(W / 2 - side * (30 + r() * 22)), moonY = Math.round(14 + r() * 8), lit = moonX < cx ? -1 : 1;
  // Sky: a dithered gradient that warms toward the topic colour at the horizon.
  const sky = [...P.sky.slice(0, 4), mix(P.sky[4], deep, 0.4)];
  const skyAt = (x, y) => { const t = Math.min(1, y / horizon) * (sky.length - 1), i = Math.floor(t); return i >= sky.length - 1 ? sky[sky.length - 1] : (t - i) * 16 > BAYER[y & 3][x & 3] ? sky[i + 1] : sky[i]; };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.set(x, y, skyAt(x, y));
  for (let i = 0; i < 55; i++) { const x = r() * W, y = r() * 52, k = r(); c.set(x, y, k < 0.15 ? P.star : k < 0.5 ? P.star2 : P.star3); }
  for (let i = 0; i < 3; i++) { const x = Math.round(r() * W), y = Math.round(6 + r() * 34); c.set(x, y, P.star); c.set(x - 1, y, P.star3); c.set(x + 1, y, P.star3); c.set(x, y - 1, P.star3); c.set(x, y + 1, P.star3); }
  // Moon: full, half or crescent, with a faint halo.
  c.glow(moonX, moonY, 14, sky[3]);
  c.disc(moonX, moonY, 7, P.moon);
  for (let i = 0; i < 4; i++) c.disc(moonX - 3 + Math.round(r() * 5), moonY - 3 + Math.round(r() * 5), 1, P.moonShade);
  c.set(moonX + 2, moonY - 3, P.moonPit); c.set(moonX - 3, moonY + 2, P.moonPit);
  const phase = r(), o = (moonX < W / 2 ? 1 : -1) * (phase < 0.35 ? 4 : 7);
  if (phase < 0.7) for (let y = -8; y <= 8; y++) for (let x = -8; x <= 8; x++) if (x * x + y * y <= 53 && (x - o) * (x - o) + (y + 1) * (y + 1) <= 50) c.set(moonX + x, moonY + y, skyAt(moonX + x, moonY + y));
  // One or two small puffy clouds, kept clear of the moon.
  for (let k = 0, n = 1 + Math.floor(r() * 2); k < n; k++) {
    const x0 = Math.round(cx - side * 6 + (r() - 0.5) * 60), y0 = Math.round(26 + r() * 12), lumps = 3 + Math.floor(r() * 2);
    if (Math.abs(x0 - moonX) < 26 && Math.abs(y0 - moonY) < 14) continue;
    for (let i = 0; i < lumps; i++) { const lx = x0 + i * 5, lr = i === 1 || i === lumps - 2 ? 3 : 2; for (let y = -lr; y <= 0; y++) for (let x = -lr - 1; x <= lr + 1; x++) if (x * x / 1.6 + y * y <= lr * lr) c.set(lx + x, y0 + y, y === -lr || (y === -lr + 1 && Math.abs(x) > lr - 1) ? P.cloud2 : P.cloud); }
    c.hline(x0 - 3, x0 + (lumps - 1) * 5 + 3, y0, P.cloud);
  }
  for (let i = 0; i < 2 + Math.floor(r() * 2); i++) { const bx = Math.round(16 + r() * (W - 32)), by = Math.round(10 + r() * 24); c.set(bx, by, P.out); c.set(bx - 1, by - 1, P.out); c.set(bx + 1, by - 1, P.out); c.set(bx - 2, by - 1, P.out); c.set(bx + 2, by - 1, P.out); }
  // Hills: a far ridge, then the near hill the building stands on, flattened under it.
  const p = [r() * 6, r() * 6, r() * 6, r() * 6];
  const far = (x) => 56 + Math.sin(x * 0.045 + p[0]) * 4 + Math.sin(x * 0.11 + p[1]) * 1.5;
  const near = (x) => { const raw = 68 + Math.sin(x * 0.04 + p[2]) * 3 + Math.sin(x * 0.13 + p[3]) * 1.2, d = Math.abs(x - cx), t = Math.min(1, Math.max(0, (d - 26) / 16)); return base * (1 - t) + raw * t; };
  for (let x = 0; x < W; x++) { const f = Math.round(far(x)); for (let y = f; y < H; y++) c.set(x, y, y === f ? P.hillFar2 : P.hillFar); }
  for (let i = 0; i < 8; i++) { const tx = Math.round(r() * W); if (Math.abs(tx - cx) > 28) pine(c, tx, Math.round(far(tx)) + 2, 5 + Math.round(r() * 3), '#131838'); }
  for (let x = 0; x < W; x++) { const n = Math.round(near(x)); for (let y = n; y < H; y++) c.set(x, y, P.hillMid); }
  // A cottage on the far side for company, then the building and a prop beside it.
  if (topic !== 'cyber' && r() < 0.7) { const hx = Math.round(cx - side * (52 + r() * 14)); if (hx > 4 && hx < W - 18) cottage(c, hx, Math.round(near(hx + 7)), lit, hue, dim); }
  const door = BUILD[topic](c, cx, base, lit, hue, dim, bright, r);
  const prop = PROPS[Math.floor(r() * PROPS.length)], px = Math.round(cx + (r() < 0.5 ? -1 : 1) * (30 + r() * 4));
  prop(c, px, base, hue, dim, bright);
  // Ground, a path from the door, trees and fireflies.
  for (let x = 0; x < W; x++) { const n = Math.round(near(x)) + 3; for (let y = Math.max(n, base + 3); y < H; y++) c.set(x, y, P.ground); }
  for (let y = door[1] + 1; y < H; y++) { const wob = Math.round(Math.sin(y * 0.45 + p[0]) * 1.2), half = 1 + Math.floor((y - door[1]) / 4); c.hline(door[0] - half + wob, door[0] + half + wob, y, P.path); }
  for (let i = 0; i < 30; i++) c.set(r() * W, base + 4 + r() * 14, P.groundSpeck);
  for (let i = 0; i < 5; i++) { const tx = Math.round(r() * W); if (Math.abs(tx - cx) > 34 && Math.abs(tx - px) > 6) pine(c, tx, Math.round(near(tx)) + 2, 9 + Math.round(r() * 7), P.tree); }
  for (let i = 0; i < 7; i++) { const fx = r() * W, fy = 60 + r() * 24; c.set(fx, fy, i % 3 ? dim : bright); }
  return c.px;
}

// ---------- a minimal PNG writer ----------
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length, 0); out.write(type, 4, 'ascii'); data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length); return out;
}
export function coverPng(slug, topic, hue, deep) {
  const px = drawCover(slug, topic, hue, deep), raw = Buffer.alloc((COVER_W * 3 + 1) * COVER_H);
  for (let y = 0; y < COVER_H; y++) {
    raw[y * (COVER_W * 3 + 1)] = 0;
    for (let x = 0; x < COVER_W; x++) { const [R, G, B] = hex(px[y * COVER_W + x] || '#000000'), o = y * (COVER_W * 3 + 1) + 1 + x * 3; raw[o] = R; raw[o + 1] = G; raw[o + 2] = B; }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(COVER_W, 0); ihdr.writeUInt32BE(COVER_H, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
