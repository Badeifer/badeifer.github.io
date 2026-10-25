// Night and Day switch, and the Edge pages (tabs, arrows, arrow keys and swipes).
(function () {
  var root = document.documentElement;
  // Night unless the visitor picked Day; the system setting is not consulted.
  var modes = [].slice.call(document.querySelectorAll('.theme [data-mode]'));
  function paint() {
    var cur = root.dataset.theme === 'day' ? 'day' : 'night';
    modes.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.mode === cur); });
  }
  modes.forEach(function (b) {
    b.addEventListener('click', function () {
      root.dataset.theme = b.dataset.mode;
      try { localStorage.setItem('theme', b.dataset.mode); } catch (e) {}
      paint();
    });
  });
  paint();

  // Reduced motion: show the first frame of each clip instead of looping it.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    [].forEach.call(document.querySelectorAll('video[autoplay]'), function (v) { v.removeAttribute('autoplay'); v.pause(); });
  }

  // Copy a tip address; the button says what happened.
  [].forEach.call(document.querySelectorAll('[data-copy]'), function (b) {
    b.addEventListener('click', function () {
      var text = document.getElementById(b.getAttribute('data-copy')).textContent, label = b.textContent;
      var done = function (ok) { b.textContent = ok ? 'Copied' : 'Select and copy it'; setTimeout(function () { b.textContent = label; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); else done(false);
    });
  });

  var edge = document.querySelector('[data-edge]');
  if (!edge) return;
  var tabs = [].slice.call(edge.querySelectorAll('[role="tab"]'));
  var pages = [].slice.call(edge.querySelectorAll('[role="tabpanel"]'));
  var cur = 0;
  var count = edge.querySelector('[data-count]'), name = edge.querySelector('[data-name]');
  function show(i, focus) {
    i = (i + tabs.length) % tabs.length;
    if (i === cur) return;
    count.textContent = (i + 1) + ' / ' + tabs.length;
    name.textContent = tabs[i].textContent;
    pages[i].style.setProperty('--from', (i > cur ? 3 : -3) + '%');
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
    pages.forEach(function (p, j) { p.hidden = j !== i; p.classList.toggle('in', j === i); });
    cur = i;
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1, true); }
    });
  });
  edge.querySelector('[data-step="-1"]').addEventListener('click', function () { show(cur - 1); });
  edge.querySelector('[data-step="1"]').addEventListener('click', function () { show(cur + 1); });
  var x0 = null;
  var screen = edge.querySelector('.edge-screen');
  screen.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
  screen.addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
  });
  screen.addEventListener('dragstart', function (e) { e.preventDefault(); });
})();
