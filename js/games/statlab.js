/* =========================================================
   Sports Stat Lab (Teens) — real math behind the game:
   averages, points-per-game and shooting percentages.
   ========================================================= */
(function () {
  const r = STEM.rand, shuffle = STEM.shuffle;
  const ROUND = 8;

  function gen() {
    const t = r(0, 2);
    if (t === 0) {
      // mean / average
      const count = r(3, 4);
      let scores, sum;
      do { scores = []; sum = 0; for (let i = 0; i < count; i++) { const s = r(6, 30); scores.push(s); sum += s; } }
      while (sum % count !== 0);
      return { q: 'A player scored ' + scores.join(', ') + ' points across her games. What is her average (mean) per game?', ans: sum / count, pct: false };
    } else if (t === 1) {
      // shooting percentage
      const ns = [2, 4, 5, 10, 20, 25, 50];
      const n = ns[r(0, ns.length - 1)];
      const m = r(1, n);
      const kind = ['free throws', 'shots', 'three-pointers'][r(0, 2)];
      return { q: 'A player made ' + m + ' of ' + n + ' ' + kind + '. What percentage did she make?', ans: (m / n) * 100, pct: true };
    } else {
      // points per game
      const G = r(3, 6), ppg = r(8, 28), T = G * ppg;
      return { q: 'A team scored ' + T + ' points across ' + G + ' games, the same each game. How many points per game?', ans: ppg, pct: false };
    }
  }

  function choices(q) {
    const set = new Set([q.ans]);
    const step = q.pct ? 5 : (q.ans > 40 ? 5 : 2);
    let g = 0;
    while (set.size < 4 && g++ < 80) {
      const v = q.ans + r(1, 4) * step * (Math.random() < 0.5 ? -1 : 1);
      if (v >= 0 && (!q.pct || v <= 100)) set.add(v);
    }
    while (set.size < 4) set.add(set.size * step + 1);
    return shuffle([...set]);
  }

  const fmt = (q, v) => q.pct ? v + '%' : String(v);

  STEM.registerGame({
    id: 'statlab',
    audience: 'teens',
    title: 'Sports Stat Lab',
    icon: '📊',
    blurb: 'Crunch the numbers behind the game',
    category: 'Sports Math',
    color: '#4a6cf7',
    stickerEmoji: '📊',
    stickerName: 'Stat Star',

    mount(stage, ctx) {
      let qi = 0, stars = 0;

      const dots = STEM.el('div', { class: 'progress-dots' });
      const prompt = STEM.el('div', { class: 'q-prompt', style: { fontSize: '1.25rem', lineHeight: '1.4' } });
      const grid = STEM.el('div', { class: 'choice-grid' });
      const feedback = STEM.el('div', { class: 'feedback' });
      stage.append(dots, prompt, grid, feedback);

      function renderDots() {
        STEM.clear(dots);
        for (let i = 0; i < ROUND; i++)
          dots.appendChild(STEM.el('span', { class: 'dot' + (i < qi ? ' done' : i === qi ? ' now' : '') }));
      }
      function setScore() { ctx.setScore('⭐ ' + stars); }

      function next() {
        renderDots();
        feedback.textContent = ''; feedback.className = 'feedback';
        STEM.clear(grid);
        const q = gen();
        let first = true;
        prompt.textContent = q.q;
        choices(q).forEach(v => {
          const b = STEM.el('button', { class: 'choice-btn', style: { fontSize: '1.4rem' }, text: fmt(q, v) });
          b.addEventListener('click', () => {
            if (b.disabled) return;
            if (v === q.ans) {
              b.classList.add('correct'); ctx.sound.good();
              feedback.className = 'feedback good'; feedback.textContent = STEM.msg.praise();
              if (first) { stars++; setScore(); }
              qi++;
              setTimeout(() => qi >= ROUND ? finish() : next(), 850);
            } else {
              first = false; b.classList.add('wrong'); b.disabled = true; ctx.sound.wrong();
              feedback.className = 'feedback try'; feedback.textContent = STEM.msg.tryAgain();
            }
          });
          grid.appendChild(b);
        });
      }

      function finish() { ctx.win({ summary: 'You solved ' + stars + ' of ' + ROUND + ' stat problems! 📊', score: stars }); }

      setScore();
      next();
    }
  });
})();
