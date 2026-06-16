/* =========================================================
   Math Blast — arithmetic with big friendly multiple-choice.
   Difficulty adapts to the player's age.
   ========================================================= */
(function () {
  const ROUND = 8;

  function makeQuestion(tier) {
    const r = STEM.rand;
    let a, b, c, op, ans, text;
    if (tier === 'easy') {
      op = ['+', '-'][r(0, 1)];
      if (op === '+') { a = r(1, 9); b = r(1, 9); ans = a + b; }
      else { a = r(2, 10); b = r(1, a); ans = a - b; }
      text = a + ' ' + op + ' ' + b;
    } else if (tier === 'medium') {
      op = ['+', '-', '×'][r(0, 2)];
      if (op === '+') { a = r(5, 30); b = r(5, 30); ans = a + b; }
      else if (op === '-') { a = r(12, 45); b = r(1, a); ans = a - b; }
      else { a = r(2, 6); b = r(2, 6); ans = a * b; }
      text = a + ' ' + op + ' ' + b;
    } else if (tier === 'hard') {
      op = ['+', '-', '×', '÷'][r(0, 3)];
      if (op === '+') { a = r(20, 99); b = r(20, 99); ans = a + b; }
      else if (op === '-') { a = r(30, 99); b = r(1, a); ans = a - b; }
      else if (op === '×') { a = r(3, 12); b = r(3, 12); ans = a * b; }
      else { b = r(3, 12); ans = r(2, 12); a = b * ans; } // a ÷ b = ans (exact)
      text = a + ' ' + op + ' ' + b;
    } else { // expert
      const kind = r(0, 3);
      if (kind === 0) { a = r(2, 15); b = r(2, 12); c = r(2, 9); ans = a + b * c; text = a + ' + ' + b + ' × ' + c; } // order of ops
      else if (kind === 1) { a = r(11, 30); b = r(11, 30); ans = a * b; text = a + ' × ' + b; }
      else if (kind === 2) { b = r(4, 15); ans = r(4, 15); a = b * ans; text = a + ' ÷ ' + b; }
      else { a = r(5, 20); ans = a * a; text = a + '²'; }
    }
    return { text: text, ans: ans };
  }

  function makeChoices(ans) {
    const set = new Set([ans]);
    let guard = 0;
    while (set.size < 4 && guard++ < 50) {
      const delta = STEM.rand(1, 4) * (Math.random() < 0.5 ? -1 : 1);
      const v = ans + delta;
      if (v >= 0) set.add(v);
    }
    while (set.size < 4) set.add(set.size); // safety
    return STEM.shuffle([...set]);
  }

  STEM.registerGame({
    id: 'math',
    title: 'Math Blast',
    icon: '➕',
    blurb: 'Zap the right number!',
    category: 'Math',
    color: '#ff5d5d',
    stickerEmoji: '🧮',
    stickerName: 'Math Wizard',

    mount(stage, ctx) {
      let qi = 0, stars = 0, locked = false;

      const dots = STEM.el('div', { class: 'progress-dots' });
      const prompt = STEM.el('div', { class: 'q-prompt' });
      const sub = STEM.el('div', { class: 'q-sub', text: 'Pick the answer!' });
      const grid = STEM.el('div', { class: 'choice-grid' });
      const feedback = STEM.el('div', { class: 'feedback' });
      stage.appendChild(dots);
      stage.appendChild(prompt);
      stage.appendChild(sub);
      stage.appendChild(grid);
      stage.appendChild(feedback);

      function renderDots() {
        STEM.clear(dots);
        for (let i = 0; i < ROUND; i++) {
          dots.appendChild(STEM.el('span', { class: 'dot' + (i < qi ? ' done' : i === qi ? ' now' : '') }));
        }
      }

      function setScore() { ctx.setScore('⭐ ' + stars); }

      function nextQuestion() {
        locked = false;
        renderDots();
        feedback.textContent = '';
        feedback.className = 'feedback';
        const q = makeQuestion(ctx.tier || ctx.difficulty);
        let firstTry = true;
        prompt.textContent = q.text + ' = ?';
        STEM.clear(grid);
        makeChoices(q.ans).forEach(val => {
          const btn = STEM.el('button', { class: 'choice-btn', text: String(val) });
          btn.addEventListener('click', () => {
            if (locked || btn.disabled) return;
            if (val === q.ans) {
              locked = true;
              btn.classList.add('correct');
              ctx.sound.good();
              feedback.textContent = STEM.msg.praise();
              feedback.className = 'feedback good';
              if (firstTry) { stars++; setScore(); }
              qi++;
              setTimeout(() => { qi >= ROUND ? finish() : nextQuestion(); }, 850);
            } else {
              firstTry = false;
              btn.classList.add('wrong');
              btn.disabled = true;
              ctx.sound.wrong();
              feedback.textContent = STEM.msg.tryAgain();
              feedback.className = 'feedback try';
            }
          });
          grid.appendChild(btn);
        });
      }

      function finish() {
        ctx.win({ summary: 'You earned ' + stars + ' of ' + ROUND + ' stars! ⭐', score: stars });
      }

      setScore();
      nextQuestion();
    }
  });
})();
