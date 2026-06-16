/* =========================================================
   Robot Coder — program a robot to reach the gem.
   Teaches sequencing & algorithmic thinking (the "coding" game).
   ========================================================= */
(function () {
  // x = column (0 = left), y = row (0 = top)
  const LEVELS = [
    { cols: 4, rows: 2, start: { x: 0, y: 1 }, goal: { x: 3, y: 1 }, walls: [] },
    { cols: 4, rows: 4, start: { x: 0, y: 3 }, goal: { x: 3, y: 0 }, walls: [] },
    { cols: 5, rows: 4, start: { x: 0, y: 3 }, goal: { x: 4, y: 3 }, walls: [{ x: 2, y: 3 }, { x: 2, y: 2 }] },
    { cols: 5, rows: 5, start: { x: 0, y: 4 }, goal: { x: 4, y: 0 },
      walls: [{ x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 2, y: 0 }] }
  ];

  const MOVES = {
    up:    { dx: 0, dy: -1, arrow: '⬆️' },
    down:  { dx: 0, dy: 1,  arrow: '⬇️' },
    left:  { dx: -1, dy: 0, arrow: '⬅️' },
    right: { dx: 1, dy: 0,  arrow: '➡️' }
  };

  STEM.registerGame({
    id: 'robot',
    title: 'Robot Coder',
    icon: '🤖',
    blurb: 'Code the robot to the gem!',
    category: 'Coding',
    color: '#3da5ff',
    stickerEmoji: '🤖',
    stickerName: 'Code Captain',

    mount(stage, ctx) {
      const levels = ctx.difficulty === 'easy' ? LEVELS.slice(0, 3) : LEVELS;
      let li = 0;
      let program = [];
      let pos = null;
      let running = false;
      let timers = [];

      function clearTimers() { timers.forEach(clearTimeout); timers = []; }
      ctx.onCleanup(clearTimers);

      const title = STEM.el('div', { class: 'q-prompt', style: { fontSize: '1.5rem', margin: '0 0 10px' } });
      const gridEl = STEM.el('div', { class: 'robot-grid' });
      const gridWrap = STEM.el('div', { class: 'robot-grid-wrap' }, gridEl);
      const progRow = STEM.el('div', { class: 'prog-row' });
      const feedback = STEM.el('div', { class: 'feedback' });

      const pad = STEM.el('div', { class: 'arrow-pad' }, [
        STEM.el('button', { class: 'arrow-btn', text: MOVES.up.arrow, 'aria-label': 'up', onClick: () => add('up') }),
        STEM.el('div', { class: 'arrow-mid' }, [
          STEM.el('button', { class: 'arrow-btn', text: MOVES.left.arrow, 'aria-label': 'left', onClick: () => add('left') }),
          STEM.el('button', { class: 'arrow-btn', text: MOVES.down.arrow, 'aria-label': 'down', onClick: () => add('down') }),
          STEM.el('button', { class: 'arrow-btn', text: MOVES.right.arrow, 'aria-label': 'right', onClick: () => add('right') })
        ])
      ]);

      const controls = STEM.el('div', { class: 'run-controls' }, [
        STEM.el('button', { class: 'pill-btn', text: '▶️ Run', onClick: run }),
        STEM.el('button', { class: 'pill-btn ghost small', text: '⌫ Undo', onClick: undo }),
        STEM.el('button', { class: 'pill-btn ghost small', text: '🗑️ Clear', onClick: clearProg })
      ]);

      stage.appendChild(title);
      stage.appendChild(gridWrap);
      stage.appendChild(STEM.el('div', { class: 'coder-label', text: '🧩 Your plan:' }));
      stage.appendChild(progRow);
      stage.appendChild(pad);
      stage.appendChild(controls);
      stage.appendChild(feedback);

      function loadLevel() {
        const lv = levels[li];
        pos = { x: lv.start.x, y: lv.start.y };
        program = [];
        running = false;
        title.textContent = '🤖 Level ' + (li + 1) + ' of ' + levels.length;
        ctx.setScore('🏁 ' + li + '/' + levels.length);
        feedback.textContent = 'Tap the arrows to plan a path, then press Run!';
        feedback.className = 'feedback';
        renderGrid();
        renderProg();
      }

      function isWall(x, y) {
        return levels[li].walls.some(w => w.x === x && w.y === y);
      }

      function renderGrid() {
        const lv = levels[li];
        gridEl.style.gridTemplateColumns = 'repeat(' + lv.cols + ', 1fr)';
        gridEl.style.maxWidth = Math.min(lv.cols * 76, 420) + 'px';
        STEM.clear(gridEl);
        for (let y = 0; y < lv.rows; y++) {
          for (let x = 0; x < lv.cols; x++) {
            const cell = STEM.el('div', { class: 'cell' });
            if (isWall(x, y)) { cell.classList.add('wall'); cell.textContent = '🧱'; }
            else if (lv.goal.x === x && lv.goal.y === y) cell.textContent = '💎';
            if (pos.x === x && pos.y === y) {
              cell.appendChild(STEM.el('span', { class: 'robot', text: '🤖' }));
            }
            gridEl.appendChild(cell);
          }
        }
      }

      function renderProg() {
        STEM.clear(progRow);
        if (program.length === 0) {
          progRow.appendChild(STEM.el('span', { class: 'prog-empty', text: 'No moves yet…' }));
          return;
        }
        program.forEach(m => progRow.appendChild(STEM.el('span', { class: 'prog-chip', text: MOVES[m].arrow })));
      }

      function add(dir) {
        if (running) return;
        if (program.length >= 24) return;
        ctx.sound.pop();
        program.push(dir);
        renderProg();
      }
      function undo() { if (running) return; ctx.sound.click(); program.pop(); renderProg(); }
      function clearProg() { if (running) return; ctx.sound.click(); program = []; renderProg(); }

      function run() {
        if (running) return;
        const lv = levels[li];
        if (program.length === 0) {
          feedback.textContent = 'Add some moves first! 🧩';
          feedback.className = 'feedback try';
          return;
        }
        running = true;
        clearTimers();
        pos = { x: lv.start.x, y: lv.start.y };
        renderGrid();
        let i = 0;

        function step() {
          if (i >= program.length) {
            // ran out of moves without landing on the gem
            feedback.textContent = 'Almost! The robot didn\'t reach the 💎. Tweak your plan!';
            feedback.className = 'feedback try';
            ctx.sound.wrong();
            running = false;
            return;
          }
          const mv = MOVES[program[i]];
          const nx = pos.x + mv.dx, ny = pos.y + mv.dy;
          if (nx < 0 || ny < 0 || nx >= lv.cols || ny >= lv.rows || isWall(nx, ny)) {
            feedback.textContent = 'Oops! The robot bumped a wall 🧱. Try a new plan!';
            feedback.className = 'feedback try';
            ctx.sound.wrong();
            running = false;
            return;
          }
          pos = { x: nx, y: ny };
          renderGrid();
          if (pos.x === lv.goal.x && pos.y === lv.goal.y) {
            ctx.sound.good();
            ctx.confetti.burst(60);
            feedback.textContent = STEM.msg.praise() + ' The robot got the gem!';
            feedback.className = 'feedback good';
            running = false;
            li++;
            if (li >= levels.length) {
              setTimeout(() => ctx.win({ summary: 'You solved all ' + levels.length + ' robot puzzles! 🤖', score: levels.length }), 1100);
            } else {
              setTimeout(loadLevel, 1300);
            }
            return;
          }
          i++;
          timers.push(setTimeout(step, 420));
        }
        timers.push(setTimeout(step, 300));
      }

      loadLevel();
    }
  });
})();
