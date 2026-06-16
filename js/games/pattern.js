/* =========================================================
   Pattern Pop — watch the pattern, then repeat it (Simon style).
   Grows the sequence each round. Builds working memory & focus.
   ========================================================= */
(function () {
  const PADS = [
    { color: '#ff5d5d', lit: '#ffd0d0', emoji: '🍓', freq: 329.63 },
    { color: '#2ecc71', lit: '#c9f7da', emoji: '🍏', freq: 392.00 },
    { color: '#3da5ff', lit: '#cfe8ff', emoji: '💧', freq: 261.63 },
    { color: '#ffd23f', lit: '#fff3c2', emoji: '🌟', freq: 493.88 }
  ];

  STEM.registerGame({
    id: 'pattern',
    title: 'Pattern Pop',
    icon: '🎵',
    blurb: 'Watch, remember, repeat!',
    category: 'Logic',
    color: '#1dd3b0',
    stickerEmoji: '🎶',
    stickerName: 'Pattern Pro',

    mount(stage, ctx) {
      const target = ctx.difficulty === 'easy' ? 5 : 8;
      let sequence = [];
      let inputIndex = 0;
      let accepting = false;
      let timers = [];

      function clearTimers() { timers.forEach(clearTimeout); timers = []; }
      ctx.onCleanup(clearTimers);

      const info = STEM.el('div', { class: 'q-sub', text: 'Watch the lights, then tap them in the same order!' });
      const grid = STEM.el('div', { class: 'pattern-pads' });
      const feedback = STEM.el('div', { class: 'feedback' });
      const startBtn = STEM.el('button', { class: 'pill-btn big', text: '▶️ Start' });

      const padEls = PADS.map((p, idx) => {
        const el = STEM.el('button', { class: 'pad', text: p.emoji });
        el.style.background = p.color;
        el.addEventListener('click', () => press(idx));
        grid.appendChild(el);
        return el;
      });

      stage.appendChild(info);
      stage.appendChild(grid);
      stage.appendChild(STEM.el('div', { style: { textAlign: 'center', marginTop: '8px' } }, startBtn));
      stage.appendChild(feedback);

      startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';
        sequence = [];
        nextRound();
      });

      function light(idx, dur) {
        const p = PADS[idx], el = padEls[idx];
        el.style.background = p.lit;
        el.classList.add('lit');
        ctx.sound.note(p.freq, (dur || 350) / 1000);
        timers.push(setTimeout(() => { el.style.background = p.color; el.classList.remove('lit'); }, dur || 350));
      }

      function nextRound() {
        sequence.push(STEM.rand(0, 3));
        inputIndex = 0;
        accepting = false;
        ctx.setScore('🎯 ' + (sequence.length - 1));
        feedback.textContent = 'Watch closely… 👀';
        feedback.className = 'feedback';
        playSequence();
      }

      function playSequence() {
        clearTimers();
        let t = 600;
        sequence.forEach(idx => {
          timers.push(setTimeout(() => light(idx, 450), t));
          t += 700;
        });
        timers.push(setTimeout(() => {
          accepting = true;
          feedback.textContent = 'Your turn! 🙌';
        }, t));
      }

      function press(idx) {
        if (!accepting) return;
        light(idx, 250);
        if (idx === sequence[inputIndex]) {
          inputIndex++;
          if (inputIndex === sequence.length) {
            accepting = false;
            if (sequence.length >= target) {
              ctx.sound.good();
              ctx.confetti.burst(100);
              feedback.textContent = STEM.msg.praise();
              feedback.className = 'feedback good';
              setTimeout(() => ctx.win({ summary: 'You repeated a pattern of ' + sequence.length + '! 🎶', score: sequence.length }), 700);
            } else {
              ctx.sound.good();
              feedback.textContent = STEM.msg.praise() + ' Next one…';
              feedback.className = 'feedback good';
              timers.push(setTimeout(nextRound, 1100));
            }
          }
        } else {
          accepting = false;
          ctx.sound.wrong();
          feedback.textContent = STEM.msg.tryAgain() + ' Watch again…';
          feedback.className = 'feedback try';
          timers.push(setTimeout(() => { inputIndex = 0; playSequence(); }, 1300));
        }
      }
    }
  });
})();
