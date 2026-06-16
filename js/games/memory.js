/* =========================================================
   Memory Match — flip cards to find matching pairs.
   Science & nature themed. Builds memory + concentration.
   ========================================================= */
(function () {
  const THEMES = [
    ['🪐', '🚀', '🌙', '⭐', '🔭', '☄️', '🛰️', '👨‍🚀'], // space
    ['🦁', '🐯', '🐘', '🦒', '🐧', '🦋', '🐢', '🦊'],     // animals
    ['🌳', '🌻', '🍄', '🐝', '🌈', '🍀', '🐞', '🦔']      // nature
  ];

  STEM.registerGame({
    id: 'memory',
    title: 'Memory Match',
    icon: '🧠',
    blurb: 'Find the matching pairs!',
    category: 'Science',
    color: '#9b5cff',
    stickerEmoji: '🧠',
    stickerName: 'Memory Master',

    mount(stage, ctx) {
      const pairs = ctx.difficulty === 'easy' ? 4 : 6;
      const theme = THEMES[STEM.rand(0, THEMES.length - 1)];
      const chosen = STEM.shuffle(theme.slice()).slice(0, pairs);
      const deck = STEM.shuffle(chosen.concat(chosen).map((emoji, i) => ({ emoji, id: i })));

      let first = null, lock = false, matched = 0, moves = 0;

      const info = STEM.el('div', { class: 'q-sub', text: 'Tap two cards to find a matching pair!' });
      const board = STEM.el('div', { class: 'memory-board' });
      const feedback = STEM.el('div', { class: 'feedback' });
      board.style.gridTemplateColumns = 'repeat(' + (pairs <= 4 ? 4 : 4) + ', 1fr)';
      board.style.maxWidth = (pairs <= 4 ? 360 : 420) + 'px';

      stage.appendChild(info);
      stage.appendChild(board);
      stage.appendChild(feedback);

      ctx.setScore('🔄 0');

      deck.forEach(card => {
        const face = STEM.el('div', { class: 'mc-face', text: card.emoji });
        const back = STEM.el('div', { class: 'mc-back', text: '❓' });
        const el = STEM.el('button', { class: 'mem-card' }, [
          STEM.el('div', { class: 'mc-inner' }, [back, face])
        ]);
        el.addEventListener('click', () => flip(el, card));
        card.el = el;
        board.appendChild(el);
      });

      function flip(el, card) {
        if (lock || el.classList.contains('open') || el.classList.contains('done')) return;
        el.classList.add('open');
        ctx.sound.pop();

        if (!first) { first = { el, card }; return; }

        moves++;
        ctx.setScore('🔄 ' + moves);

        if (first.card.emoji === card.emoji) {
          first.el.classList.add('done');
          el.classList.add('done');
          first = null;
          matched++;
          ctx.sound.good();
          feedback.textContent = STEM.msg.praise();
          feedback.className = 'feedback good';
          if (matched === pairs) {
            ctx.confetti.burst(100);
            setTimeout(() => ctx.win({
              summary: 'You found all ' + pairs + ' pairs in ' + moves + ' tries! 🧠',
              score: Math.max(1, pairs * 4 - moves)
            }), 700);
          }
        } else {
          lock = true;
          ctx.sound.wrong();
          feedback.textContent = STEM.msg.tryAgain();
          feedback.className = 'feedback try';
          const a = first; first = null;
          setTimeout(() => {
            a.el.classList.remove('open');
            el.classList.remove('open');
            lock = false;
          }, 850);
        }
      }
    }
  });
})();
