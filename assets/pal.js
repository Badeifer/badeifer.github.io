// Pixel pal: a little pixel character that roams the page doing silly things. Click him for options:
// keep him pinned at the top, let him roam, or hide him. The choice is remembered in localStorage.
// Drawn with canvas rects (no images). Respects prefers-reduced-motion (he stays pinned and only idles).
(function () {
  'use strict';
  var KEY = 'palMode';
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* default */ }
  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ } }
  var mode = load();
  if (mode !== 'roam' && mode !== 'top' && mode !== 'hidden') mode = reduce ? 'top' : 'roam';

  // ---------------------------------------------------------------- styles
  var css = '.pal{position:fixed;left:0;top:0;width:120px;height:120px;z-index:70;pointer-events:none;will-change:transform}' +
    '.pal canvas{position:absolute;left:0;top:0;width:120px;height:120px;image-rendering:pixelated;image-rendering:crisp-edges}' +
    '.pal-btn{position:absolute;left:30px;top:26px;width:60px;height:74px;pointer-events:auto;background:none;border:0;padding:0;cursor:pointer;border-radius:4px}' +
    '.pal-btn:focus-visible{outline:3px solid var(--gold,#e8b64c);outline-offset:2px}' +
    '.pal-say{position:absolute;left:50%;bottom:104px;transform:translateX(-50%);white-space:nowrap;pointer-events:none;background:var(--bg2,#1c2148);color:var(--ink,#ede6d3);' +
    'border:2px solid var(--line,#353d75);box-shadow:3px 3px 0 var(--line,#353d75);font:600 13px/1.2 var(--text,system-ui,sans-serif);padding:5px 9px;opacity:0;transition:opacity .15s}' +
    '.pal-say.on{opacity:1}' +
    '.pal-menu{position:fixed;z-index:71;display:grid;gap:8px;min-width:190px;padding:12px;background:var(--bg2,#1c2148);color:var(--ink,#ede6d3);border:2px solid var(--line,#353d75);box-shadow:6px 6px 0 var(--line,#353d75)}' +
    '.pal-menu p{margin:0 0 2px;font:700 12px/1.2 var(--text,system-ui,sans-serif);letter-spacing:.06em;text-transform:uppercase;color:var(--muted,#a9aecf)}' +
    '.pal-menu button{font:600 15px/1.2 var(--text,system-ui,sans-serif);text-align:left;padding:9px 12px;color:var(--ink,#ede6d3);background:var(--bg,#141833);border:2px solid var(--line,#353d75);cursor:pointer}' +
    '.pal-menu button:hover,.pal-menu button:focus-visible{border-color:var(--ink,#ede6d3);outline:none}' +
    '.pal-back{position:fixed;left:14px;bottom:14px;z-index:70;width:44px;height:44px;padding:0;background:var(--bg2,#1c2148);border:2px solid var(--line,#353d75);box-shadow:3px 3px 0 var(--line,#353d75);cursor:pointer;image-rendering:pixelated}' +
    '.pal-back:hover,.pal-back:focus-visible{border-color:var(--ink,#ede6d3);outline:none}' +
    '.pal-back canvas{width:32px;height:32px;display:block;margin:auto;image-rendering:pixelated}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------------------------------------------------------------- drawing the character (24x28 logical pixels)
  var SKIN = '#ede6d3', INK = '#0b0e26', HOOD = '#e8b64c', HOODD = '#9a7424', HOODL = '#f4da96', LEG = '#353d75', SHOE = '#a9aecf', BLUSH = '#ff9f8a';
  var buf = document.createElement('canvas'); buf.width = 24; buf.height = 28;
  var bc = buf.getContext('2d');
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); }

  function arm(c, side, kind, ph, by) {
    var x = side < 0 ? 6 : 16, y = 15 + by;
    if (kind === 'up') { R(c, x, y - 6, 2, 7, HOOD); R(c, x, y - 7, 2, 1, SKIN); }
    else if (kind === 'wave') { var o = Math.round(Math.sin(ph * 14) * 1.5); R(c, x + (side > 0 ? 1 : -1) + o, y - 6, 2, 7, HOOD); R(c, x + (side > 0 ? 1 : -1) + o, y - 7, 2, 1, SKIN); }
    else if (kind === 'out') { var ox = side < 0 ? 2 : 16; R(c, ox, y, 6, 2, HOOD); R(c, side < 0 ? 1 : 22, y, 1, 2, SKIN); }
    else if (kind === 'swing') { var s = Math.round(Math.sin(ph) * 2 * -side); R(c, x + s, y, 2, 4, HOOD); R(c, x + s, y + 4, 2, 1, SKIN); }
    else if (kind === 'bent') { var b = Math.round(Math.sin(ph) * 2 * -side); R(c, x + b, y, 2, 3, HOOD); R(c, x + b + (side > 0 ? 1 : -1), y + 2, 2, 2, HOOD); }
    else if (kind === 'scratch') { var j = Math.round(Math.sin(ph * 18)); R(c, x, y - 4, 2, 5, HOOD); R(c, x + j - 1, y - 7 + 1, 2, 2, SKIN); }
    else { R(c, x, y, 2, 5, HOOD); R(c, x, y + 5, 2, 1, SKIN); }
  }

  function drawChar(c, p) {
    c.clearRect(0, 0, 24, 28);
    var by = p.bob || 0, sit = p.sit ? 4 : 0;
    // legs
    if (p.sit) { R(c, 9, 22 + sit - 1, 7, 2, LEG); R(c, 16, 21 + sit, 2, 3, SHOE); }
    else {
      var ph = p.legs, a = ph == null ? 0 : Math.round(Math.sin(ph) * 2), la = ph == null ? 0 : Math.max(0, Math.round(Math.cos(ph) * 1.5)), lb = ph == null ? 0 : Math.max(0, Math.round(-Math.cos(ph) * 1.5));
      if (p.jump) { R(c, 9, 21 + by, 2, 3, LEG); R(c, 13, 21 + by, 2, 3, LEG); R(c, 8, 24 + by, 3, 1, SHOE); R(c, 13, 24 + by, 3, 1, SHOE); }
      else {
        R(c, 9 + a, 21 + by + la, 2, 4 - la, LEG); R(c, 8 + a, 25 - la * 0, 3, 1, SHOE);
        R(c, 13 - a, 21 + by + lb, 2, 4 - lb, LEG); R(c, 13 - a, 25 - lb * 0, 3, 1, SHOE);
      }
    }
    // arms behind the body first, then body, then head
    var al = p.armL || 'down', ar = p.armR || 'down';
    arm(c, -1, al, p.armPh || 0, by + sit); arm(c, 1, ar, (p.armPh || 0) + 3, by + sit);
    R(c, 8, 14 + by + sit, 8, 7, HOOD); R(c, 8, 19 + by + sit, 8, 2, HOODD); R(c, 8, 14 + by + sit, 8, 1, HOODL); R(c, 11, 16 + by + sit, 2, 2, HOODD);
    var hy = 5 + by + sit;
    R(c, 7, hy, 10, 9, SKIN);
    R(c, 7, hy - 2, 10, 3, HOODD); R(c, 7, hy - 2, 10, 1, HOOD); R(c, 11, hy - 4, 2, 2, HOODL); R(c, 6, hy, 1, 2, HOODD); R(c, 17, hy, 1, 2, HOODD);
    // eyes
    var look = p.look || 0, ex = [9 + Math.round(look), 14 + Math.round(look)], ey = hy + 4, e = p.eyes || 'open';
    for (var i = 0; i < 2; i++) {
      if (e === 'closed' || e === 'blink') R(c, ex[i], ey + 1, 2, 1, INK);
      else if (e === 'wide') { R(c, ex[i] - 0, ey - 1, 2, 3, '#fff'); R(c, ex[i] + (look > 0 ? 1 : 0), ey, 1, 2, INK); R(c, ex[i], ey - 3, 2, 1, INK); }
      else if (e === 'dizzy') { R(c, ex[i], ey, 2, 1, INK); R(c, ex[i] + (i ? 0 : 1), ey + 1, 1, 1, INK); R(c, ex[i], ey + 2, 2, 1, INK); }
      else R(c, ex[i], ey, 2, 2, INK);
    }
    R(c, 8, hy + 6, 1, 1, BLUSH); R(c, 15, hy + 6, 1, 1, BLUSH);
    var m = p.mouth || 'smile', my = hy + 7;
    if (m === 'o') R(c, 11, my - 1, 2, 2, INK);
    else if (m === 'big') { R(c, 10, my - 1, 4, 3, INK); R(c, 11, my + 1, 2, 1, '#ff6b6b'); }
    else if (m === 'flat') R(c, 10, my, 4, 1, INK);
    else if (m === 'grin') { R(c, 10, my - 1, 4, 2, INK); R(c, 10, my - 1, 4, 1, '#fff'); }
    else { R(c, 10, my - 1, 1, 1, INK); R(c, 13, my - 1, 1, 1, INK); R(c, 11, my, 2, 1, INK); }
    // dark outline around everything drawn
    var img = c.getImageData(0, 0, 24, 28), d = img.data, out = new Uint8ClampedArray(d.length);
    function al8(x, y) { return x < 0 || y < 0 || x > 23 || y > 27 ? 0 : d[(y * 24 + x) * 4 + 3]; }
    for (var y = 0; y < 28; y++) for (var x = 0; x < 24; x++) {
      var o = (y * 24 + x) * 4;
      if (d[o + 3] === 0 && (al8(x - 1, y) || al8(x + 1, y) || al8(x, y - 1) || al8(x, y + 1))) { out[o] = 11; out[o + 1] = 14; out[o + 2] = 38; out[o + 3] = 255; }
    }
    for (var k = 0; k < d.length; k += 4) if (out[k + 3]) { d[k] = out[k]; d[k + 1] = out[k + 1]; d[k + 2] = out[k + 2]; d[k + 3] = 255; }
    c.putImageData(img, 0, 0);
  }

  // ---------------------------------------------------------------- elements
  var wrap, disp, dc, btn, say, menu, back;
  function build() {
    wrap = document.createElement('div'); wrap.className = 'pal'; wrap.setAttribute('role', 'group');
    disp = document.createElement('canvas'); disp.width = 40; disp.height = 40; disp.setAttribute('aria-hidden', 'true');
    dc = disp.getContext('2d'); dc.imageSmoothingEnabled = false;
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pal-btn'; btn.setAttribute('aria-label', 'Pixel pal. Press for options: keep him at the top, let him roam, or hide him.');
    say = document.createElement('div'); say.className = 'pal-say'; say.setAttribute('aria-hidden', 'true');
    wrap.appendChild(disp); wrap.appendChild(say); wrap.appendChild(btn);
    document.body.appendChild(wrap);
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggleMenu(); });
  }

  // ---------------------------------------------------------------- state
  var W = window.innerWidth, H = window.innerHeight;
  var P = { x: 0, y: 0, tx: 0, ty: 0, face: 1, st: 'idle', t: 0, dur: 2, dir: 1, h: 0, ang: 0, sx: 1, sy: 1, legs: null, bob: 0, eyes: 'open', mouth: 'smile', look: 0, armL: 'down', armR: 'down', armPh: 0, sit: false, jump: false, blinkIn: 2.5, blinkT: 0, sayT: 0, sleepZ: 0, cool: 3 };
  var mouse = { x: -999, y: -999, t: 0, sp: 0, lx: -999, ly: -999, lt: 0 };
  var menuOpen = false, last = 0, dust = [], stars = [];
  var LINES = ['hi!', 'nice article', 'found a bug', 'pixels everywhere', 'send snacks', 'still reading?', 'scroll, human', 'i live here now', 'beep. i mean, hello', 'rendering... done', 'did you patch yet?', 'this page is 100% organic pixels'];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function clampPos() { P.x = Math.max(60, Math.min(W - 60, P.x)); P.y = Math.max(110, Math.min(H - 14, P.y)); }
  function setTop() { P.x = W - 80; P.y = 150; P.face = -1; }
  function speak(t, secs) { say.textContent = t; say.classList.add('on'); P.sayT = secs || 2.2; }
  function go(name, dur, extra) { P.st = name; P.t = 0; P.dur = dur; P.legs = null; P.armL = 'down'; P.armR = 'down'; P.sit = false; P.jump = false; P.h = 0; P.ang = 0; P.sx = 1; P.sy = 1; P.eyes = 'open'; P.mouth = 'smile'; P.look = 0; P.bob = 0; P.dir = Math.random() < 0.5 ? -1 : 1; if (extra) extra(); }

  function pick() {
    var pinned = mode === 'top';
    var opts = pinned
      ? [['wave', 7], ['dance', 7], ['sleep', 6], ['look', 7], ['scratch', 5], ['hop', 6], ['flip', 5], ['say', 5], ['spin', 4]]
      : [['walk', 22], ['run', 14], ['hop', 7], ['flip', 6], ['spin', 4], ['wave', 5], ['dance', 7], ['sleep', 6], ['trip', 4], ['look', 6], ['scratch', 4], ['chase', 6], ['moonwalk', 5], ['say', 5]];
    var sum = 0, i; for (i = 0; i < opts.length; i++) sum += opts[i][1];
    var r = Math.random() * sum; for (i = 0; i < opts.length; i++) { r -= opts[i][1]; if (r <= 0) break; }
    start(opts[Math.min(i, opts.length - 1)][0]);
  }

  function travel(speedPx) {
    var ang = Math.random() * Math.PI * 2, d = rand(140, 420);
    P.tx = Math.max(60, Math.min(W - 60, P.x + Math.cos(ang) * d)); P.ty = Math.max(110, Math.min(H - 14, P.y + Math.sin(ang) * d * 0.6));
    P.speed = speedPx;
  }

  function start(name) {
    var pinned = mode === 'top';
    switch (name) {
      case 'walk': go('walk', 8, function () { travel(62); }); break;
      case 'run': go('run', 8, function () { travel(190); }); break;
      case 'moonwalk': go('moonwalk', 8, function () { travel(58); speak('smooth.', 2); }); break;
      case 'hop': go('hop', 0.7, function () { P.mouth = 'grin'; }); break;
      case 'flip': go('flip', 0.95, function () { P.mouth = 'grin'; if (!pinned) { P.tx = Math.max(60, Math.min(W - 60, P.x + P.dir * 120)); } else P.tx = P.x; P.ty = P.y; P.x0 = P.x; }); break;
      case 'spin': go('spin', 1.1, function () { P.mouth = 'grin'; }); break;
      case 'wave': go('wave', 2.6, function () { P.armR = 'wave'; if (Math.random() < 0.6) speak('hi!', 1.8); }); break;
      case 'dance': go('dance', 3.2, function () { P.eyes = 'closed'; P.mouth = 'grin'; }); break;
      case 'sleep': go('sleep', 9, function () { P.sit = true; }); break;
      case 'trip': go('trip', 4.2, function () { P.legs = 0; travel(200); }); break;
      case 'look': go('look', 3, function () { P.mouth = 'o'; }); break;
      case 'scratch': go('scratch', 2.2, function () { P.armR = 'scratch'; P.eyes = 'wide'; }); break;
      case 'chase': if (mouse.t > 0 && performance.now() - mouse.t < 5000) go('chase', 3.2, function () { P.speed = 150; }); else start('walk'); break;
      case 'say': go('idle', 2.6, function () { speak(LINES[Math.floor(Math.random() * LINES.length)], 2.4); }); break;
      case 'startle': go('startle', 1.6, function () { P.eyes = 'wide'; P.mouth = 'o'; speak('!', 1); P.dir = mouse.x < P.x ? 1 : -1; P.face = P.dir; }); break;
      default: go('idle', rand(1.2, 2.8));
    }
  }

  function moveToward(tx, ty, sp, dt) {
    var dx = tx - P.x, dy = ty - P.y, d = Math.hypot(dx, dy);
    if (d < 4) return true;
    var s = Math.min(d, sp * dt); P.x += dx / d * s; P.y += dy / d * s;
    if (Math.abs(dx) > 1) P.face = dx > 0 ? 1 : -1;
    return false;
  }
  function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function arc(u) { return 4 * u * (1 - u); }

  function update(dt) {
    P.t += dt;
    if (P.sayT > 0) { P.sayT -= dt; if (P.sayT <= 0) say.classList.remove('on'); }
    P.cool -= dt;
    // blinking
    P.blinkIn -= dt; if (P.blinkIn <= 0) { P.blinkT = 0.12; P.blinkIn = rand(2, 5); }
    if (P.blinkT > 0) P.blinkT -= dt;
    var u = Math.min(1, P.t / P.dur);
    P.h = 0; P.sx = 1; P.sy = 1; P.bob = 0; P.ang = 0;
    if (menuOpen) { P.st = 'menu'; P.legs = null; P.armR = 'wave'; P.armPh = P.t; P.mouth = 'smile'; return; }
    P.legs = P.legs; P.armPh += dt * 10;
    switch (P.st) {
      case 'menu': start('idle'); break;
      case 'idle': P.bob = Math.sin(P.t * 3) > 0.6 ? 1 : 0; P.legs = null; if (P.t >= P.dur) pick(); break;
      case 'walk': case 'moonwalk': case 'run': case 'chase': {
        var run = P.st === 'run' || P.st === 'chase';
        var tx = P.tx, ty = P.ty;
        if (P.st === 'chase') { tx = mouse.x; ty = mouse.y + 40; }
        var at = moveToward(tx, ty, P.speed, dt);
        if (P.st === 'moonwalk') P.face = -P.face;
        P.legs = (P.legs || 0) + dt * (run ? 16 : 9); P.armL = run ? 'bent' : 'swing'; P.armR = run ? 'bent' : 'swing'; P.bob = run ? (Math.floor(P.t * 14) % 2 ? 0 : -1) : 0;
        if (run && Math.floor(P.t * 9) !== Math.floor((P.t - dt) * 9)) dust.push({ x: -P.face * 8, y: 0, t: 0 });
        if (P.st === 'chase' && Math.hypot(mouse.x - P.x, mouse.y + 40 - P.y) < 60) { speak('got you', 1.6); start('hop'); break; }
        if (at || P.t >= P.dur) { if (P.st === 'chase') speak('too slow', 1.4); pick(); }
        break;
      }
      case 'hop': P.h = 56 * arc(u); P.jump = u > 0.1 && u < 0.9; P.armL = 'up'; P.armR = 'up'; P.sy = u < 0.12 ? 0.8 : u > 0.9 ? 0.85 : 1.08; P.sx = P.sy < 1 ? 1.12 : 0.94; if (u >= 1) pick(); break;
      case 'flip': {
        var e = ease(u); P.h = 70 * arc(u); P.jump = true; P.ang = -P.dir * Math.PI * 2 * e; P.x = P.x0 + (P.tx - P.x0) * e; P.armL = 'up'; P.armR = 'up'; P.sy = (u < 0.08 || u > 0.93) ? 0.82 : 1;
        if (u >= 1) { P.x = P.tx; pick(); } break;
      }
      case 'spin': P.h = 34 * arc(u); P.jump = true; P.sx = Math.cos(u * Math.PI * 8); P.armL = 'out'; P.armR = 'out'; if (u >= 1) { P.sx = 1; pick(); } break;
      case 'wave': P.armPh = P.t * 1; P.eyes = P.blinkT > 0 ? 'blink' : 'open'; P.bob = Math.sin(P.t * 4) > 0.5 ? 1 : 0; if (u >= 1) pick(); break;
      case 'dance': {
        var beat = Math.floor(P.t * 5) % 2; P.armL = beat ? 'up' : 'down'; P.armR = beat ? 'down' : 'up'; P.bob = beat ? 0 : 1; P.legs = P.t * 12; P.x += Math.sin(P.t * 5) * 18 * dt; P.h = Math.abs(Math.sin(P.t * 10)) * 5;
        P.face = Math.sin(P.t * 2.5) > 0 ? 1 : -1; if (u >= 1) pick(); break;
      }
      case 'sleep': {
        P.sit = true; P.legs = null;
        if (P.t < 0.6) { P.sy = 1; P.eyes = 'open'; }
        else if (P.t < 1.9) { P.mouth = 'big'; P.eyes = 'closed'; P.armL = 'up'; P.armR = 'up'; if (!P.said1) { speak('*yawn*', 1.6); P.said1 = 1; } }
        else if (P.t < 7.2) { P.mouth = 'flat'; P.eyes = 'closed'; P.bob = Math.sin(P.t * 2) > 0 ? 1 : 0; P.said1 = 0; if (Math.floor(P.t * 0.6) !== Math.floor((P.t - dt) * 0.6)) speak('zzz', 1.6); }
        else { P.eyes = 'wide'; P.mouth = 'o'; P.sit = false; P.h = 24 * arc(Math.min(1, (P.t - 7.2) / 0.5)); P.jump = true; if (!P.said2) { speak('!', 1); P.said2 = 1; } }
        if (u >= 1) { P.said2 = 0; P.said1 = 0; pick(); }
        break;
      }
      case 'trip': {
        if (P.t < 0.9) { moveToward(P.tx, P.ty, P.speed, dt); P.legs = (P.legs || 0) + dt * 16; P.armL = 'bent'; P.armR = 'bent'; if (Math.floor(P.t * 9) !== Math.floor((P.t - dt) * 9)) dust.push({ x: -P.face * 8, y: 0, t: 0 }); }
        else if (P.t < 1.1) { P.ang = P.face * (Math.PI / 2) * ((P.t - 0.9) / 0.2); P.x += P.face * 90 * dt; P.eyes = 'wide'; P.mouth = 'o'; P.h = 14 * arc((P.t - 0.9) / 0.2); P.jump = true; if (!P.said1) { speak('whoa!', 1.4); P.said1 = 1; } }
        else if (P.t < 2.9) { P.ang = P.face * Math.PI / 2; P.eyes = 'dizzy'; P.mouth = 'flat'; P.sy = 1; P.h = -6; if (!P.said2) { speak('ow', 1.6); P.said2 = 1; } }
        else if (P.t < 3.4) { P.ang = P.face * (Math.PI / 2) * (1 - (P.t - 2.9) / 0.5); P.eyes = 'closed'; }
        else { P.armR = 'scratch'; P.eyes = 'open'; P.mouth = 'grin'; }
        if (u >= 1) { P.said1 = 0; P.said2 = 0; pick(); }
        break;
      }
      case 'look': P.look = Math.sin(P.t * 2.2) * 1; P.eyes = 'open'; P.armPh = 0; if (u > 0.4 && !P.said1) { speak('?', 1.2); P.said1 = 1; } if (u >= 1) { P.said1 = 0; pick(); } break;
      case 'scratch': P.armPh = P.t; P.look = -1; P.eyes = 'open'; if (u >= 1) pick(); break;
      case 'startle': {
        if (P.t < 0.45) { P.h = 36 * arc(P.t / 0.45); P.jump = true; P.armL = 'up'; P.armR = 'up'; }
        else { P.legs = (P.legs || 0) + dt * 18; P.armL = 'bent'; P.armR = 'bent'; P.x += P.dir * 230 * dt; P.y += (P.y > H / 2 ? -40 : 40) * dt; P.face = P.dir; P.eyes = 'wide'; }
        if (u >= 1) pick();
        break;
      }
      default: start('idle');
    }
    clampPos();
    if (P.sx === 0) P.sx = 0.001;
  }

  // ---------------------------------------------------------------- drawing
  function render() {
    var p = { legs: P.legs, sit: P.sit, jump: P.jump, bob: P.bob, eyes: P.blinkT > 0 && P.eyes === 'open' ? 'blink' : P.eyes, mouth: P.mouth, look: P.look, armL: P.armL, armR: P.armR, armPh: P.armPh };
    drawChar(bc, p);
    dc.clearRect(0, 0, 40, 40);
    // soft shadow on the ground, shrinking as he rises
    var sh = Math.max(0.35, 1 - P.h / 120);
    dc.fillStyle = 'rgba(3,4,16,0.35)'; dc.fillRect(Math.round(20 - 7 * sh), 32, Math.round(14 * sh), 2);
    for (var i = dust.length - 1; i >= 0; i--) {
      var d = dust[i]; d.t += 0.016;
      if (d.t > 0.45) { dust.splice(i, 1); continue; }
      var s = 1 + Math.floor(d.t * 6); dc.fillStyle = 'rgba(237,230,211,' + (0.7 - d.t).toFixed(2) + ')';
      dc.fillRect(Math.round(20 + d.x * 0.33 - s / 2), Math.round(31 - d.t * 8), s, s);
    }
    dc.save();
    dc.translate(20, 32 - Math.round(P.h / 3));
    dc.scale(P.face * (P.sx || 1), P.sy);
    dc.translate(0, -12);
    if (P.ang) dc.rotate(P.ang);
    dc.translate(-12, -14);
    dc.drawImage(buf, 0, 0);
    dc.restore();
    if (P.st === 'trip' && P.t > 1.1 && P.t < 2.9) {  // little stars circling his head
      for (var k = 0; k < 3; k++) { var a = P.t * 7 + k * 2.1; dc.fillStyle = '#e8b64c'; dc.fillRect(Math.round(20 + Math.cos(a) * 8), Math.round(18 + Math.sin(a) * 2) - 2, 2, 2); }
    }
    wrap.style.transform = 'translate(' + Math.round(P.x - 60) + 'px,' + Math.round(P.y - 96) + 'px)';
  }

  // ---------------------------------------------------------------- menu and modes
  function closeMenu() { if (menu) { menu.remove(); menu = null; } menuOpen = false; }
  function openMenu() {
    closeMenu(); menuOpen = true;
    menu = document.createElement('div'); menu.className = 'pal-menu'; menu.setAttribute('role', 'menu');
    var title = document.createElement('p'); title.textContent = 'Pixel pal'; menu.appendChild(title);
    function item(label, fn) { var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.textContent = label; b.addEventListener('click', function (e) { e.stopPropagation(); closeMenu(); fn(); }); menu.appendChild(b); return b; }
    var first = mode === 'top' ? item('Let him roam', function () { setMode('roam'); }) : item('Keep him at the top', function () { setMode('top'); });
    item('Hide him', function () { setMode('hidden'); });
    item('Never mind', function () {});
    document.body.appendChild(menu);
    var mw = menu.offsetWidth, mh = menu.offsetHeight;
    var left = Math.max(8, Math.min(W - mw - 8, P.x - mw / 2)), top = P.y + 14 + mh < H ? P.y + 14 : Math.max(8, P.y - 100 - mh);
    menu.style.left = left + 'px'; menu.style.top = top + 'px';
    first.focus();
  }
  function toggleMenu() { if (menuOpen) closeMenu(); else openMenu(); }
  document.addEventListener('click', function (e) { if (menuOpen && menu && !menu.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { closeMenu(); btn && btn.focus(); } });

  function setMode(m) {
    mode = m; save(m);
    if (m === 'hidden') { if (wrap) { wrap.remove(); wrap = null; } showBack(); return; }
    hideBack();
    if (!wrap) { build(); P.x = rand(100, W - 100); P.y = rand(160, H - 40); }
    if (m === 'top') { setTop(); start('wave'); } else start('hop');
  }
  function showBack() {
    hideBack();
    back = document.createElement('button'); back.type = 'button'; back.className = 'pal-back'; back.setAttribute('aria-label', 'Bring back the pixel pal');
    var cv = document.createElement('canvas'); cv.width = 24; cv.height = 24; var c = cv.getContext('2d');
    var tmp = document.createElement('canvas'); tmp.width = 24; tmp.height = 28; var tc = tmp.getContext('2d');
    drawChar(tc, { legs: null, eyes: 'open', mouth: 'smile', armL: 'down', armR: 'down' });
    c.imageSmoothingEnabled = false; c.drawImage(tmp, 0, 2, 24, 22, 0, 0, 24, 24);
    back.appendChild(cv); document.body.appendChild(back);
    back.addEventListener('click', function () { setMode(reduce ? 'top' : 'roam'); });
  }
  function hideBack() { if (back) { back.remove(); back = null; } }

  // ---------------------------------------------------------------- input and loop
  window.addEventListener('resize', function () { W = window.innerWidth; H = window.innerHeight; if (mode === 'top') setTop(); clampPos(); });
  window.addEventListener('mousemove', function (e) {
    var now = performance.now(), dt = Math.max(1, now - mouse.lt);
    mouse.sp = Math.hypot(e.clientX - mouse.lx, e.clientY - mouse.ly) / dt * 1000;
    mouse.lx = mouse.x = e.clientX; mouse.ly = mouse.y = e.clientY; mouse.lt = mouse.t = now;
    if (mode === 'roam' && !menuOpen && P.cool <= 0 && P.st !== 'startle' && P.st !== 'trip' && P.st !== 'sleep' && mouse.sp > 1400 && Math.hypot(e.clientX - P.x, e.clientY - (P.y - 40)) < 90) { P.cool = 8; start('startle'); }
  }, { passive: true });

  function tick(ts) {
    var dt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts;
    if (wrap) { update(dt); render(); }
    requestAnimationFrame(tick);
  }

  function init() {
    if (mode === 'hidden') { showBack(); return; }
    build();
    P.x = rand(120, W - 120); P.y = rand(180, H - 40);
    if (mode === 'top') { setTop(); start('wave'); } else start('hop');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  requestAnimationFrame(tick);
  window.__pal = { start: function (n) { if (wrap) start(n); }, state: function () { return P.st; }, mode: function () { return mode; } };
})();
