/* =========================================================
   Count & Tap — counting and number sense for little ones.
   Mixes "How many?" with "Tap exactly N".
   ========================================================= */
(function () {
  const ITEMS = ['🍎', '🍌', '🐠', '🦋', '⭐', '🚗', '🐢', '🎈', '🍓', '🐥'];
  const ROUND = 8;

  STEM.registerGame({
    id: 'count',
    audience: 'juniors',
    title: 'Count & Tap',
    icon: '🔢',
    blurb: 'How many can you count?',
    category: 'Math',
    color: '#ff8a3d',
    stickerEmoji: '🔢',
    stickerName: 'Counting Champ',

    mount(stage, ctx) {
      const maxN = ctx.difficulty === 'easy' ? 5 : 10;
      let qi = 0, stars = 0;

      const dots = STEM.el('div', { class: 'progress-dots' });
      const prompt = STEM.el('div', { class: 'q-prompt' });
      const field = STEM.el('div', { class: 'count-field' });
      const choices = STEM.el('div', { class: 'choice-grid' });
      const feedback = STEM.el('div', { class: 'feedback' });

      stage.appendChild(dots);
      stage.appendChild(prompt);
      stage.appendChild(field);
      stage.appendChild(choices);
      stage.appendChild(feedback);

      function renderDots() {
        STEM.clear(dots);
        for (let i = 0; i < ROUND; i++)
          dots.appendChild(STEM.el('span', { class: 'dot' + (i < qi ? ' done' : i === qi ? ' now' : '') }));
      }
      function setScore() { ctx.setScore('⭐ ' + stars); }
      function clearFeedback() { feedback.textContent = ''; feedback.className = 'feedback'; }

      function next() {
        renderDots();
        clearFeedback();
        STEM.clear(field);
        STEM.clear(choices);
        // alternate between the two game types
        if (qi % 2 === 0) howMany(); else tapN();
      }

      function howMany() {
        const item = ITEMS[STEM.rand(0, ITEMS.length - 1)];
        const n = STEM.rand(1, maxN);
        prompt.textContent = 'How many ' + item + ' ?';
        for (let i = 0; i < n; i++) field.appendChild(STEM.el('span', { class: 'count-emoji', text: item }));

        const opts = new Set([n]);
        while (opts.size < 4) { const v = STEM.rand(1, maxN + 2); if (v >= 1) opts.add(v); }
        let first = true;
        STEM.shuffle([...opts]).forEach(v => {
          const b = STEM.el('button', { class: 'choice-btn', text: String(v) });
          b.addEventListener('click', () => {
            if (b.disabled) return;
            if (v === n) {
              b.classList.add('correct');
              ctx.sound.good();
              feedback.textContent = STEM.msg.praise();
              feedback.className = 'feedback good';
              if (first) { stars++; setScore(); }
              qi++;
              setTimeout(() => qi >= ROUND ? finish() : next(), 850);
            } else {
              first = false;
              b.classList.add('wrong'); b.disabled = true;
              ctx.sound.wrong();
              feedback.textContent = STEM.msg.tryAgain();
              feedback.className = 'feedback try';
            }
          });
          choices.appendChild(b);
        });
      }

      function tapN() {
        const item = ITEMS[STEM.rand(0, ITEMS.length - 1)];
        const target = STEM.rand(2, Math.max(3, maxN - 1));
        const total = Math.min(12, target + STEM.rand(2, 4));
        prompt.textContent = 'Tap exactly ' + target + ' ' + item + ' !';
        let selected = 0;
        let done = false;

        for (let i = 0; i < total; i++) {
          const it = STEM.el('button', { class: 'count-item', text: item });
          it.addEventListener('click', () => {
            if (done) return;
            const on = it.classList.toggle('picked');
            selected += on ? 1 : -1;
            ctx.sound.pop();
            if (selected === target) {
              done = true;
              ctx.sound.good();
              feedback.textContent = STEM.msg.praise();
              feedback.className = 'feedback good';
              stars++; setScore();
              qi++;
              setTimeout(() => qi >= ROUND ? finish() : next(), 900);
            } else if (selected > target) {
              feedback.textContent = 'That\'s a few too many — tap one again to unpick it! 🙂';
              feedback.className = 'feedback try';
            } else {
              feedback.textContent = 'Picked ' + selected + '… keep going!';
              feedback.className = 'feedback';
            }
          });
          field.appendChild(it);
        }
      }

      function finish() {
        ctx.win({ summary: 'You scored ' + stars + ' of ' + ROUND + ' stars! ⭐', score: stars });
      }

      setScore();
      next();
    }
  });
})();
