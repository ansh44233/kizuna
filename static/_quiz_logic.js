
/* =========================================================
   HOW WELL DO YOU KNOW US? — game logic
   You shouldn't need to edit this file. All content is in data.js.
   ========================================================= */
(function () {
  'use strict';

  const D = window.GAME_DATA;
  const $ = (sel, root = document) => root.querySelector(sel);

  if (!D || !Array.isArray(D.questions) || !D.questions.length) {
    $('#app').innerHTML =
      '<p class="load-error">Couldn\'t load the questions from <b>data.js</b> 🥺<br>' +
      'Check it for a missing comma, bracket or quote.</p>';
    return;
  }

  const S = D.settings || {};
  const CATS = D.categories || [];
  const catById = {};
  CATS.forEach(c => { catById[c.id] = c; });
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RING_C = 2 * Math.PI * 88;

  /* ---------- helpers ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  const pick = arr => (arr && arr.length ? arr[Math.floor(Math.random() * arr.length)] : '');
  const rand = (a, b) => a + Math.random() * (b - a);
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function fill(str, extra) {
    if (str == null) return '';
    const map = Object.assign({}, S, extra || {});
    return String(str).replace(/\{(\w+)\}/g, (m, k) => (map[k] != null ? map[k] : m));
  }
  function show(name) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.toggle('active', s.id === 'screen-' + name);
    });
    window.scrollTo(0, 0);
  }
  function restartAnim(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }
  function buzz(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* not supported (iOS) */ }
  }

  /* ---------- static text ---------- */
  document.querySelectorAll('[data-bind]').forEach(el => {
    const v = S[el.dataset.bind];
    if (v != null && v !== '') el.textContent = fill(v);
  });
  if (S.title) document.title = fill(S.title);
  if (S.photoCaption) $('#photo-caption').textContent = fill(S.photoCaption);
  if (S.welcomePhoto) {
    const ph = $('#welcome-photo');
    const img = new Image();
    img.onload = () => {
      ph.style.backgroundImage = 'url("' + S.welcomePhoto.replace(/"/g, '%22') + '")';
      ph.innerHTML = '';
    };
    img.src = S.welcomePhoto;
  }
  const L = D.secretMessage || {};
  $('#env-label').textContent = fill(L.envelopeLabel || 'For you 💌');

  /* ---------- floating hearts & stars ---------- */
  (function makeFloaters() {
    const wrap = $('#floaters');
    const glyphs = ['♥', '♡', '✦', '✧', '⋆', '❀', '♥', '✦', '♡'];
    const n = reduceMotion ? 0 : (window.innerWidth < 500 ? 16 : 26);
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'floater c' + (1 + (i % 4));
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = rand(0, 100) + '%';
      s.style.fontSize = rand(12, 28) + 'px';
      s.style.animationDuration = rand(14, 28) + 's';
      s.style.animationDelay = -rand(0, 28) + 's';
      s.style.setProperty('--drift', rand(-60, 60) + 'px');
      s.style.setProperty('--rot', rand(-180, 180) + 'deg');
      s.style.setProperty('--o', rand(0.35, 0.8).toFixed(2));
      wrap.appendChild(s);
    }
  })();

  /* ---------- particle effects ---------- */
  const fx = $('#fx');
  function burst(el, kind) {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width * rand(0.3, 0.7);
    const cy = r.top + r.height / 2;
    const love = kind === 'love';
    const glyphs = love ? ['💗', '💜', '✨', '💕', '♡', '⭐', '💖'] : ['💔', '🥺', '💧'];
    const n = love ? 20 : 7;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'particle' + (love ? '' : ' sad');
      p.textContent = pick(glyphs);
      const ang = rand(0, Math.PI * 2);
      const dist = love ? rand(60, 170) : rand(20, 60);
      const dx = Math.cos(ang) * dist;
      const dy = love ? Math.sin(ang) * dist - 50 : rand(70, 150);
      p.style.setProperty('--sx', cx + 'px');
      p.style.setProperty('--sy', cy + 'px');
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--r', rand(-70, 70) + 'deg');
      p.style.fontSize = rand(14, 30) + 'px';
      p.style.animationDelay = rand(0, 90) + 'ms';
      fx.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }
  }
  function rain(n) {
    if (reduceMotion) return;
    const glyphs = ['💗', '💜', '💕', '✨', '🌸', '💖', '♡'];
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'particle rain';
      p.textContent = pick(glyphs);
      p.style.setProperty('--sx', rand(0, window.innerWidth) + 'px');
      p.style.setProperty('--dx', rand(-80, 80) + 'px');
      p.style.setProperty('--r', rand(-240, 240) + 'deg');
      p.style.fontSize = rand(16, 32) + 'px';
      const dur = rand(2.6, 4.6);
      p.style.animationDuration = dur + 's';
      p.style.animationDelay = rand(0, 1600) + 'ms';
      fx.appendChild(p);
      setTimeout(() => p.remove(), (dur + 1.8) * 1000);
    }
  }

  /* ---------- edit-mode hints ---------- */
  (function editHints() {
    let placeholders = 0;
    const re = /\[[^\]]+\]/g;
    const walk = v => {
      if (typeof v === 'string') { const m = v.match(re); if (m) placeholders += m.length; }
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object') Object.keys(v).forEach(k => walk(v[k]));
    };
    walk(D.questions); walk(D.secretMessage); walk(D.results); walk(S.photoCaption);
    const toCheck = D.questions.filter(q => q.edit).length;
    if (S.showEditHints !== false && (placeholders || toCheck)) {
      const note = $('#edit-note');
      note.textContent = '✏️ Edit mode: ' + placeholders + ' [placeholders] to fill and ' + toCheck +
        ' answers to confirm in data.js. Set showEditHints: false when you\'re done.';
      note.hidden = false;
      console.info('[Know Us] ' + placeholders + ' placeholders, ' + toCheck + ' answers to confirm.');
    }
  })();

  function updateWelcomeMeta() {
    const best = parseInt(store.get('knowus_best'), 10);
    $('#welcome-meta').textContent = Number.isFinite(best)
      ? 'Best score so far: ' + best + '% ♡'
      : D.questions.length + ' questions · ' + CATS.length + ' little chapters';
  }
  updateWelcomeMeta();

  /* ---------- game state ---------- */
  let round = [];
  let idx = 0;
  let score = 0;
  let locked = false;
  let catStats = {};
  let chapterNext = null;
  let unlocked = false;

  function buildRound() {
    const out = [];
    const take = qs => (S.shuffleQuestionsInCategory ? shuffle(qs) : qs);
    CATS.forEach(c => out.push(...take(D.questions.filter(q => q.category === c.id))));
    out.push(...D.questions.filter(q => !catById[q.category])); // uncategorised go last
    return out.map(q => {
      const options = Array.isArray(q.options) ? q.options : [];
      let ans = Number(q.answer);
      if (!Number.isInteger(ans) || ans < 0 || ans >= options.length) {
        console.warn('[Know Us] Bad "answer" for question:', q.question, '— using the first option.');
        ans = 0;
      }
      const opts = options.map((text, i) => ({ text, correct: i === ans }));
      return Object.assign({}, q, { opts: S.shuffleOptions === false ? opts : shuffle(opts) });
    }).filter(q => q.opts.length >= 2);
  }

  function startGame() {
    round = buildRound();
    idx = 0;
    score = 0;
    catStats = {};
    $('#hud-score').textContent = '0';
    setProgress(0);
    goTo(0);
  }

  function goTo(i) {
    idx = i;
    if (i >= round.length) { showResult(); return; }
    const q = round[i];
    const prev = round[i - 1];
    if (!prev || prev.category !== q.category) showChapter(i, renderQuestion);
    else renderQuestion();
  }

  /* ---------- chapter intro ---------- */
  function showChapter(i, then) {
    const q = round[i];
    const cat = catById[q.category] || { name: 'Bonus round', emoji: '✨', description: 'A few extra ones, just for fun.' };
    let chapterNo = 0;
    for (let k = 0; k <= i; k++) if (k === 0 || round[k].category !== round[k - 1].category) chapterNo++;
    const count = round.filter(x => x.category === q.category).length;

    $('#chapter-num').textContent = 'Chapter ' + chapterNo;
    $('#chapter-emoji').textContent = cat.emoji || '✨';
    $('#chapter-title').textContent = fill(cat.name);
    $('#chapter-desc').textContent = fill(cat.description || '');
    $('#chapter-count').textContent = count + (count === 1 ? ' question' : ' questions');
    $('#btn-chapter').textContent = i === 0 ? "I'm ready ✨" : "Let's go ✨";
    chapterNext = then;
    show('chapter');
    restartAnim($('.chapter-card'), 'chapter-card');
  }
  $('#btn-chapter').addEventListener('click', () => {
    if (typeof chapterNext === 'function') { const fn = chapterNext; chapterNext = null; fn(); }
  });

  /* ---------- question ---------- */
  const optionsEl = $('#options');
  const card = $('#q-card');
  const feedback = $('#feedback');

  function setProgress(frac) {
    const pct = Math.max(0, Math.min(1, frac)) * 100;
    $('#progress-fill').style.width = pct + '%';
    $('#progress-heart').style.left = pct + '%';
    $('#progress').setAttribute('aria-valuenow', Math.round(pct));
  }

  function renderQuestion() {
    const q = round[idx];
    const cat = catById[q.category] || {};
    const chip = $('#q-chip');
    chip.textContent = (cat.emoji || '✨') + ' ' + fill(cat.name || 'Bonus');
    chip.style.setProperty('--chip-bg', cat.color || '');
    $('#hud-count').textContent = 'Question ' + (idx + 1) + ' of ' + round.length;
    setProgress(idx / round.length);

    $('#q-label').textContent = q.label ? fill(q.label) : 'question no. ' + (idx + 1) + ' ♡';
    $('#q-text').textContent = fill(q.question);
    const editBadge = $('#edit-badge');
    if (editBadge) editBadge.hidden = !(q.edit && S.showEditHints !== false);

    optionsEl.innerHTML = '';
    q.opts.forEach((o, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.style.setProperty('--d', (140 + k * 80) + 'ms');
      const key = document.createElement('span');
      key.className = 'key';
      key.textContent = 'ABCDEFGH'[k];
      const txt = document.createElement('span');
      txt.className = 'opt-text';
      txt.textContent = fill(o.text);
      b.append(key, txt);
      b.addEventListener('click', () => answer(b, o));
      optionsEl.appendChild(b);
    });

    feedback.classList.remove('show');
    locked = false;
    show('question');
    restartAnim(card, 'enter');
  }

  function answer(btn, o) {
    if (locked) return;
    locked = true;
    const q = round[idx];
    const stats = catStats[q.category] || (catStats[q.category] = { right: 0, total: 0 });
    stats.total++;

    const buttons = Array.from(optionsEl.children);
    buttons.forEach(b => { b.disabled = true; });
    const correctIndex = q.opts.findIndex(x => x.correct);
    const correctBtn = buttons[correctIndex];
    let title;

    if (o.correct) {
      score++;
      stats.right++;
      btn.classList.add('correct');
      btn.querySelector('.key').textContent = '✓';
      buttons.forEach(b => { if (b !== btn) b.classList.add('dim'); });
      burst(btn, 'love');
      buzz(25);
      const hs = $('#hud-score');
      hs.textContent = String(score);
      restartAnim(hs.parentElement, 'bump');
      title = fill(q.reactionCorrect) || fill(pick(S.correctReactions)) || 'Correct! 💜';
      $('#fb-text').textContent = '';
    } else {
      btn.classList.add('wrong');
      btn.querySelector('.key').textContent = '✕';
      if (correctBtn) {
        correctBtn.classList.add('reveal');
        correctBtn.querySelector('.key').textContent = '✓';
      }
      buttons.forEach(b => { if (b !== btn && b !== correctBtn) b.classList.add('dim'); });
      burst(btn, 'sad');
      buzz([40, 50, 40]);
      title = fill(q.reactionWrong) || fill(pick(S.wrongReactions)) || 'Not quite 🥺';
      const right = q.opts[correctIndex];
      $('#fb-text').textContent = right ? 'The right answer was “' + fill(right.text) + '”.' : '';
    }

    $('#fb-title').textContent = title;
    $('#fb-note').textContent = fill(q.note || '');
    $('#btn-next').textContent = idx === round.length - 1 ? 'See my results ♡' : 'Next question →';
    setProgress((idx + 1) / round.length);

    setTimeout(() => {
      feedback.classList.add('show');
      const r = feedback.getBoundingClientRect();
      if (r.bottom > window.innerHeight - 10) {
        feedback.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' });
      }
    }, o.correct ? 500 : 650);
  }

  $('#btn-next').addEventListener('click', () => {
    if (!locked) return;
    goTo(idx + 1);
  });

  /* ---------- result ---------- */
  function showResult() {
    const total = round.length;
    const pct = total ? Math.round((score / total) * 100) : 0;
    const extra = { score, total, percent: pct };
    const tiers = (D.results || []).slice().sort((a, b) => b.min - a.min);
    const tier = tiers.find(t => pct >= t.min) || tiers[tiers.length - 1] || { title: 'Done!', message: '' };

    $('#result-emoji').textContent = tier.emoji || '💞';
    $('#result-title').textContent = fill(tier.title, extra);
    $('#result-msg').textContent = fill(tier.message, extra);
    $('#ring-total').textContent = '/' + total;
    $('#ring-score').textContent = '0';
    $('#ring-pct').textContent = '0%';

    // per-chapter breakdown
    const bd = $('#breakdown');
    bd.innerHTML = '';
    const ids = CATS.map(c => c.id).filter(id => catStats[id]);
    Object.keys(catStats).forEach(id => { if (!ids.includes(id)) ids.push(id); });
    ids.forEach(id => {
      const c = catById[id] || { name: 'Bonus', emoji: '✨' };
      const st = catStats[id];
      const row = document.createElement('div');
      row.className = 'bd-row';
      const name = document.createElement('span');
      name.textContent = (c.emoji || '') + ' ' + fill(c.name);
      const val = document.createElement('span');
      val.textContent = st.right + '/' + st.total;
      const bar = document.createElement('div');
      bar.className = 'bd-bar';
      const fillBar = document.createElement('i');
      fillBar.dataset.w = (st.total ? (st.right / st.total) * 100 : 0) + '%';
      bar.appendChild(fillBar);
      row.append(name, val, bar);
      bd.appendChild(row);
    });
    bd.hidden = ids.length === 0;

    // best score
    const prevBest = parseInt(store.get('knowus_best'), 10);
    let meta = '';
    if (!Number.isFinite(prevBest) || pct > prevBest) {
      store.set('knowus_best', String(pct));
      if (Number.isFinite(prevBest)) meta = 'New best score! ✨';
    } else {
      meta = 'Best score: ' + prevBest + '%';
    }
    $('#result-meta').textContent = meta;
    updateWelcomeMeta();

    show('result');

    // animate ring + numbers
    const ring = $('#ring-fg');
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = RING_C;
    void ring.getBoundingClientRect();
    ring.style.transition = '';
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = RING_C * (1 - pct / 100);
      bd.querySelectorAll('i').forEach(i => { i.style.width = i.dataset.w; });
    });
    const start = performance.now();
    const dur = reduceMotion ? 1 : 1400;
    (function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      $('#ring-score').textContent = String(Math.round(score * e));
      $('#ring-pct').textContent = Math.round(pct * e) + '%';
      if (t < 1) requestAnimationFrame(tick);
    })(start);

    if (pct >= 60) setTimeout(() => rain(pct === 100 ? 60 : 34), 700);
  }

  /* ---------- secret letter ---------- */
  function renderLetter() {
    $('#l-greet').textContent = fill(L.greeting || 'Hey you,');
    const body = $('#l-body');
    body.innerHTML = '';
    let delay = 500;
    $('#l-greet').style.setProperty('--d', '250ms');
    (L.paragraphs || []).forEach(text => {
      const p = document.createElement('p');
      p.textContent = fill(text);
      p.style.setProperty('--d', delay + 'ms');
      delay += 650;
      body.appendChild(p);
    });
    $('#l-close').textContent = fill(L.closing || '');
    $('#l-close').style.setProperty('--d', delay + 'ms');
    $('#l-sign').textContent = fill(L.signature || S.yourName || '');
    $('#l-sign').style.setProperty('--d', (delay + 400) + 'ms');
    $('#l-ps').textContent = fill(L.ps || '');
    $('#l-ps').style.setProperty('--d', (delay + 1000) + 'ms');
    return delay + 1200;
  }

  function openLetterScreen() {
    const needsCode = !!(L.passcode && String(L.passcode).trim()) && !unlocked;
    $('#lock').hidden = !needsCode;
    $('#env-wrap').hidden = needsCode;
    $('#env-wrap').classList.remove('gone');
    $('#envelope').classList.remove('open');
    $('#letter').hidden = true;
    $('#letter-actions').hidden = true;
    if (needsCode) {
      $('#lock-text').textContent = 'This letter is locked. Only the real ' + fill('{herNickname}') + ' knows the secret word.';
      $('#lock-hint').textContent = L.passcodeHint ? 'hint: ' + fill(L.passcodeHint) : '';
      $('#lock-err').textContent = '';
      $('#lock-input').value = '';
    }
    show('letter');
  }

  const norm = s => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  $('#lock-form').addEventListener('submit', e => {
    e.preventDefault();
    if (norm($('#lock-input').value) === norm(L.passcode)) {
      unlocked = true;
      $('#lock-input').blur();
      $('#lock').hidden = true;
      $('#env-wrap').hidden = false;
      burst($('#env-wrap'), 'love');
    } else {
      $('#lock-err').textContent = 'Hmm, that\'s not it 🙈 try again';
      restartAnim($('#lock'), 'shake');
      buzz([40, 50, 40]);
    }
  });

  $('#envelope').addEventListener('click', () => {
    const env = $('#envelope');
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    buzz(30);
    setTimeout(() => {
      $('#env-wrap').classList.add('gone');
      setTimeout(() => {
        $('#env-wrap').hidden = true;
        const total = renderLetter();
        const letter = $('#letter');
        letter.hidden = false;
        restartAnim(letter, 'letter');
        window.scrollTo(0, 0);
        rain(40);
        setTimeout(() => { $('#letter-actions').hidden = false; }, reduceMotion ? 0 : total);
      }, 500);
    }, 1100);
  });

  /* ---------- buttons ---------- */
  $('#btn-start').addEventListener('click', startGame);
  $('#btn-replay').addEventListener('click', startGame);
  $('#btn-letter').addEventListener('click', openLetterScreen);
  $('#btn-letter-replay').addEventListener('click', startGame);
  $('#btn-letter-back').addEventListener('click', () => show('result'));

  /* ---------- keyboard (laptop) ---------- */
  document.addEventListener('keydown', e => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (!$('#screen-question').classList.contains('active')) return;
    if (!locked) {
      const map = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
      const k = map[e.key.toLowerCase()];
      if (k != null && optionsEl.children[k]) optionsEl.children[k].click();
    } else if (e.key === 'Enter' && feedback.classList.contains('show')) {
      e.preventDefault();
      $('#btn-next').click();
    }
  });
})();

