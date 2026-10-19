/* BLOOM — From Cherry to Cup · behaviour: cup, reveal-on-scroll, episode player */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Episode data (swap files here if you re-export) ---------- */
  var EPISODES = [
    { n: 1, title: 'Cherry Hill',     src: 'assets/videos/Scene_01_The_Cherry_hill_st.mp4', poster: 'assets/images/frame-01.jpg', vtt: 'captions/episode-01.vtt',
      blurb: 'A girl rides a cart across the floating islands, leaps to the cherry tree and gathers the ripe red cherries with her wand.' },
    { n: 2, title: 'The Little Fire', src: 'assets/videos/Scene_02_The%20Little_Fire_st.mp4', poster: 'assets/images/frame-02.jpg', vtt: 'captions/episode-02.vtt',
      blurb: 'At the little mill in the clouds, the cherries tumble into the pulper, the beans dry in the sun and roast over a little fire, and the girl turns the grinder crank.' },
    { n: 3, title: 'The Bloom',       src: 'assets/videos/Scene_03_The%20Bloom_st.mp4', poster: 'assets/images/frame-03.jpg', vtt: 'captions/episode-03.vtt',
      blurb: 'The kettle tips a silky stream of milk into the filter, a coffee waterfall pours into the giant cup, and a blossom opens on top.' }
  ];

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Little bee pops up on every click ---------- */
  var BEE_SVG = '<svg viewBox="0 0 48 40" width="40" height="34" aria-hidden="true" focusable="false">' +
    '<ellipse class="bee-wing" cx="19" cy="9" rx="8" ry="6"/>' +
    '<ellipse class="bee-wing" cx="29" cy="8" rx="7" ry="5.5"/>' +
    '<ellipse cx="24" cy="24" rx="15" ry="11" fill="#F5C518" stroke="#1F120C" stroke-width="2"/>' +
    '<path d="M19 13.6v20.8M26 13v22" stroke="#1F120C" stroke-width="4"/>' +
    '<path d="M39 24l5 0" stroke="#1F120C" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="12" cy="21" r="2" fill="#1F120C"/>' +
    '<path d="M9 13q-3-5 1-8M13 12q0-5 4-6" stroke="#1F120C" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '</svg>';
  if (!reduce) {
    document.addEventListener('click', function (e) {
      var x = e.clientX, y = e.clientY;
      if (!e.detail) { // keyboard activation: start from the middle of the element
        var r = e.target.getBoundingClientRect ? e.target.getBoundingClientRect() : null;
        if (!r) return;
        x = r.left + r.width / 2; y = r.top + r.height / 2;
      }
      var bee = document.createElement('span');
      bee.className = 'bee-pop';
      bee.setAttribute('aria-hidden', 'true');
      bee.innerHTML = BEE_SVG;
      bee.style.left = x + 'px';
      bee.style.top = y + 'px';
      bee.style.setProperty('--drift', (Math.random() * 80 - 40).toFixed(0) + 'px');
      if (Math.random() < 0.5) bee.classList.add('flip');
      // inside an open modal the page body sits below the top layer, so fly from the dialog
      var host = (e.target.closest && e.target.closest('dialog[open]')) || document.body;
      host.appendChild(bee);
      bee.addEventListener('animationend', function () { bee.remove(); });
      setTimeout(function () { if (bee.parentNode) bee.remove(); }, 1600);
    });
  }

  /* ---------- Navbar: highlight the section currently on screen ---------- */
  var navLinks = document.querySelectorAll('.nav a[data-nav]');
  if (navLinks.length) {
    var navMap = {};
    Array.prototype.forEach.call(navLinks, function (a) { navMap[a.getAttribute('data-nav')] = a; });
    var navSections = ['episodes', 'girl', 'craft', 'documents']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    var navLock = 0;
    var setActive = function (key) {
      Array.prototype.forEach.call(navLinks, function (a) {
        if (a.getAttribute('data-nav') === key) {
          a.setAttribute('aria-current', key === 'top' ? 'page' : 'location');
        } else {
          a.removeAttribute('aria-current');
        }
      });
    };
    var updateNav = function () {
      if (Date.now() < navLock) return;
      var line = window.innerHeight * 0.35;
      var key = 'top';
      navSections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top <= line) key = sec.id;
      });
      // at the very bottom of the page, the last section is the one being read
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        key = navSections[navSections.length - 1].id;
      }
      setActive(key);
    };
    Array.prototype.forEach.call(navLinks, function (a) {
      a.addEventListener('click', function () {
        setActive(a.getAttribute('data-nav'));
        // keep the clicked item highlighted while the smooth scroll runs
        navLock = Date.now() + 900;
      });
    });
    var navTick = false;
    window.addEventListener('scroll', function () {
      if (navTick) return;
      navTick = true;
      window.requestAnimationFrame(function () { navTick = false; updateNav(); });
    }, { passive: true });
    window.addEventListener('hashchange', updateNav);
    updateNav();
  }

  /* ---------- Click the cup ---------- */
  var cup = document.getElementById('cup');
  if (cup) {
    cup.addEventListener('click', function () {
      if (cup.classList.contains('poured')) return;
      cup.classList.add('poured');
      setTimeout(function () {
        var target = document.getElementById('episodes');
        var heading = document.getElementById('episodes-title');
        if (target) { target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          setTimeout(function () { heading.focus({ preventScroll: true }); }, reduce ? 0 : 700);
        }
        setTimeout(function () { cup.classList.remove('poured'); }, 1400);
      }, reduce ? 0 : 900);
    });
  }

  /* ---------- Billboard: hover or click a card to swap the featured episode ---------- */
  var billboard = document.getElementById('billboard');
  if (billboard) {
    var bbInner = document.getElementById('bb-inner');
    var bbEyebrow = document.getElementById('bb-eyebrow');
    var bbTitle = document.getElementById('bb-title');
    var bbText = document.getElementById('bb-text');
    var bbPlay = document.getElementById('bb-play');
    var bbPlayLabel = document.getElementById('bb-play-label');
    var bbImgs = billboard.querySelectorAll('[data-bb-img]');
    var bbDots = billboard.querySelectorAll('.bb-dots i');
    var pickers = document.querySelectorAll('[data-select]');
    var shown = 0, swapTimer = null;

    var showEpisode = function (i) {
      if (i === shown) return;
      shown = i;
      var ep = EPISODES[i];
      Array.prototype.forEach.call(bbImgs, function (img, k) {
        if (k === i) img.removeAttribute('loading');
        img.classList.toggle('is-active', k === i);
      });
      Array.prototype.forEach.call(bbDots, function (d, k) { d.classList.toggle('is-active', k === i); });
      Array.prototype.forEach.call(pickers, function (b) {
        var on = parseInt(b.getAttribute('data-select'), 10) === i;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.closest('.ep').classList.toggle('is-active', on);
      });
      var fill = function () {
        bbEyebrow.textContent = 'Now showing · Episode ' + ep.n;
        bbTitle.textContent = ep.title;
        bbText.textContent = ep.blurb;
        bbPlay.href = ep.src;
        bbPlay.setAttribute('data-ep', String(i));
        bbPlayLabel.textContent = 'Play episode ' + ep.n;
        bbInner.classList.remove('is-swapping');
      };
      clearTimeout(swapTimer);
      if (reduce) { fill(); return; }
      bbInner.classList.add('is-swapping');
      swapTimer = setTimeout(fill, 180);
    };

    var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    Array.prototype.forEach.call(pickers, function (b) {
      var i = parseInt(b.getAttribute('data-select'), 10);
      if (canHover) b.addEventListener('mouseenter', function () { showEpisode(i); });
      b.addEventListener('focus', function () { showEpisode(i); });
      b.addEventListener('click', function () {
        showEpisode(i);
        // the billboard sits below the posters: scroll to it only if it is mostly out of view
        var r = billboard.getBoundingClientRect();
        if (r.top > window.innerHeight - 160 || r.bottom < 80) {
          billboard.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---------- Documents: when served over http, mark files that are not uploaded yet ---------- */
  if (location.protocol.indexOf('http') === 0 && window.fetch) {
    Array.prototype.forEach.call(document.querySelectorAll('.doc'), function (card) {
      var link = card.querySelector('a[download]');
      if (!link) return;
      fetch(link.getAttribute('href'), { method: 'HEAD' }).then(function (res) {
        if (res.ok) return;
        card.classList.add('is-missing');
        var note = document.createElement('p');
        note.className = 'doc-missing';
        note.textContent = 'Coming soon: this document has not been uploaded yet.';
        card.appendChild(note);
      }).catch(function () {});
    });
  }

  /* ---------- Episode player ---------- */
  var dlg = document.getElementById('player');
  if (!dlg) return;
  var video = document.getElementById('pv');
  var titleEl = document.getElementById('player-title');
  var eyebrowEl = document.getElementById('player-eyebrow');
  var queue = document.getElementById('queue');
  var note = document.getElementById('pnote');
  var closeBtn = document.getElementById('player-close');
  var current = 0, playAll = false, lastFocus = null;
  var DEFAULT_NOTE = 'Sound on for the narration.';

  EPISODES.forEach(function (ep, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = ep.n + ' · ' + ep.title;
    b.addEventListener('click', function () { playAll = false; load(i, true); });
    queue.appendChild(b);
  });

  function setTrack(ep) {
    Array.prototype.slice.call(video.querySelectorAll('track')).forEach(function (t) { t.remove(); });
    var t = document.createElement('track');
    t.kind = 'captions'; t.srclang = 'en'; t.label = 'English'; t.src = ep.vtt;
    video.appendChild(t);
  }

  function load(i, autoplay) {
    current = i;
    var ep = EPISODES[i];
    titleEl.textContent = ep.title;
    eyebrowEl.textContent = 'Episode ' + ep.n + (playAll ? ' · Playing all' : '');
    note.textContent = DEFAULT_NOTE;
    Array.prototype.forEach.call(queue.children, function (b, k) {
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    video.poster = ep.poster;
    video.src = ep.src;
    setTrack(ep);
    video.load();
    if (autoplay) {
      var p = video.play();
      if (p && p.catch) p.catch(function () { note.textContent = 'Press play to start.'; });
    }
  }

  function openPlayer(i, all) {
    lastFocus = document.activeElement;
    playAll = !!all;
    load(i, true);
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); }
    else { dlg.setAttribute('open', ''); }
  }

  function closePlayer() {
    video.pause();
    if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
  }

  dlg.addEventListener('close', function () {
    video.pause();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  });
  closeBtn.addEventListener('click', closePlayer);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closePlayer(); });

  video.addEventListener('ended', function () {
    if (playAll && current < EPISODES.length - 1) {
      load(current + 1, true);
    } else if (playAll) {
      note.textContent = 'That was BLOOM. Thanks for watching.';
      playAll = false;
    } else if (current < EPISODES.length - 1) {
      note.textContent = 'Next up: ' + EPISODES[current + 1].title + '.';
    } else {
      note.textContent = 'That was BLOOM. Thanks for watching.';
    }
  });
  video.addEventListener('error', function () {
    note.textContent = 'This video could not be loaded. Check that the assets/videos folder is next to index.html.';
  });

  document.querySelectorAll('[data-ep]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openPlayer(parseInt(el.getAttribute('data-ep'), 10), false);
    });
  });
  document.querySelectorAll('[data-play-all]').forEach(function (el) {
    el.addEventListener('click', function () { openPlayer(0, true); });
  });
})();
