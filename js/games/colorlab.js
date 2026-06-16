/* =========================================================
   Color Lab — mix primary colors to make new ones.
   A gentle intro to color science.
   ========================================================= */
(function () {
  const COLORS = {
    red:    '#ff5d5d',
    yellow: '#ffd23f',
    blue:   '#3da5ff',
    orange: '#ff8a3d',
    green:  '#2ecc71',
    purple: '#9b5cff'
  };
  const PRIMARIES = ['red', 'yellow', 'blue'];
  const MIXES = { 'red+yellow': 'orange', 'blue+yellow': 'green', 'blue+red': 'purple' };
  const ROUND = 8;

  function mix(a, b) { return MIXES[[a, b].sort().join('+')]; }

  function swatch(name, big) {
    const s = STEM.el('span', { class: 'swatch' + (big ? ' big' : '') });
    s.style.background = COLORS[name];
    return s;
  }

  STEM.registerGame({
    id: 'colorlab',
    title: 'Color Lab',
    icon: '🎨',
    blurb: 'Mix colors like a scientist!',
    category: 'Science',
    color: '#2ecc71',
    stickerEmoji: '🎨',
    stickerName: 'Color Scientist',

    mount(stage, ctx) {
      let qi = 0, stars = 0;

      const dots = STEM.el('div', { class: 'progress-dots' });
      const eq = STEM.el('div', { class: 'color-eq' });
      const prompt = STEM.el('div', { class: 'q-sub' });
      const choices = STEM.el('div', { class: 'choice-grid color-choices' });
      const feedback = STEM.el('div', { class: 'feedback' });

      stage.appendChild(dots);
      stage.appendChild(prompt);
      stage.appendChild(eq);
      stage.appendChild(choices);
      stage.appendChild(feedback);

      function renderDots() {
        STEM.clear(dots);
        for (let i = 0; i < ROUND; i++)
          dots.appendChild(STEM.el('span', { class: 'dot' + (i < qi ? ' done' : i === qi ? ' now' : '') }));
      }
      function setScore() { ctx.setScore('⭐ ' + stars); }

      function buildChoices(answer, onPick) {
        const pool = Object.keys(COLORS).filter(c => c !== answer);
        STEM.shuffle(pool);
        const opts = STEM.shuffle([answer, pool[0], pool[1], pool[2]]);
        let first = true;
        STEM.clear(choices);
        opts.forEach(name => {
          const b = STEM.el('button', { class: 'choice-btn color-choice' }, [
            swatch(name, true),
            STEM.el('span', { class: 'swatch-name', text: name })
          ]);
          b.addEventListener('click', () => {
            if (b.disabled) return;
            if (name === answer) {
              b.classList.add('correct');
              ctx.sound.good();
              feedback.textContent = STEM.msg.praise();
              feedback.className = 'feedback good';
              if (first) { stars++; setScore(); }
              qi++;
              setTimeout(() => qi >= ROUND ? finish() : next(), 900);
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

      function next() {
        renderDots();
        feedback.textContent = ''; feedback.className = 'feedback';
        STEM.clear(eq);

        const key = STEM.shuffle(Object.keys(MIXES))[0];
        const [a, b] = key.split('+');
        const result = MIXES[key];
        const reverse = ctx.difficulty !== 'easy' && Math.random() < 0.4;

        if (!reverse) {
          // A + B = ?
          prompt.textContent = 'What do you get when you mix these?';
          eq.appendChild(swatch(a, true));
          eq.appendChild(STEM.el('span', { class: 'eq-sym', text: '+' }));
          eq.appendChild(swatch(b, true));
          eq.appendChild(STEM.el('span', { class: 'eq-sym', text: '=' }));
          eq.appendChild(STEM.el('span', { class: 'eq-q', text: '?' }));
          buildChoices(result, true);
        } else {
          // A + ? = Result  (find the missing primary)
          prompt.textContent = 'Which color is missing to make this?';
          eq.appendChild(swatch(a, true));
          eq.appendChild(STEM.el('span', { class: 'eq-sym', text: '+' }));
          eq.appendChild(STEM.el('span', { class: 'eq-q', text: '?' }));
          eq.appendChild(STEM.el('span', { class: 'eq-sym', text: '=' }));
          eq.appendChild(swatch(result, true));
          buildChoices(b, true);
        }
      }

      function finish() {
        ctx.win({ summary: 'You mixed ' + stars + ' of ' + ROUND + ' colors right! 🎨', score: stars });
      }

      setScore();
      next();
    }
  });
})();
