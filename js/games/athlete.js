/* =========================================================
   Future Athlete Power (MAAT) — train like your favorite pro!
   Pick an athlete, build daily habits (by age), eat for power,
   learn sports trivia, and get moving. Health + Sport.
   ========================================================= */
(function () {
  const el = STEM.el, shuffle = STEM.shuffle;

  const SPORT_EMOJI = { Basketball: '🏀', Soccer: '⚽', Football: '🏈' };

  // Women athletes featured first (built for a girls' basketball coach!).
  const ATHLETES = [
    // ---- Basketball / WNBA ----
    { id: 'aja',     name: "A'ja Wilson",            sport: 'Basketball', league: 'WNBA', country: 'USA',       position: 'Forward',      fact: 'A WNBA MVP and champion known for her defense and hard work.', habit: 'practices footwork every single day.' },
    { id: 'clark',   name: 'Caitlin Clark',          sport: 'Basketball', league: 'WNBA', country: 'USA',       position: 'Guard',        fact: 'Famous for her amazing long-distance three-point shots.',     habit: 'shoots hundreds of practice shots to stay sharp.' },
    { id: 'stewart', name: 'Breanna Stewart',        sport: 'Basketball', league: 'WNBA', country: 'USA',       position: 'Forward',      fact: 'A WNBA champion and MVP who started playing when she was young.', habit: 'warms up and stretches before every game.' },
    { id: 'sabrina', name: 'Sabrina Ionescu',        sport: 'Basketball', league: 'WNBA', country: 'USA',       position: 'Guard',        fact: 'Known for her all-around game and incredible shooting.',       habit: 'trains ball-handling with both hands.' },
    // ---- Basketball / NBA ----
    { id: 'curry',   name: 'Stephen Curry',          sport: 'Basketball', league: 'NBA',  country: 'USA',       position: 'Guard',        fact: 'Changed basketball with his record three-point shooting.',     habit: 'does dribbling drills to warm up.' },
    { id: 'lebron',  name: 'LeBron James',           sport: 'Basketball', league: 'NBA',  country: 'USA',       position: 'Forward',      fact: 'One of the greatest ever, famous for staying super fit.',      habit: 'sleeps lots and eats healthy to recover.' },
    { id: 'giannis', name: 'Giannis Antetokounmpo',  sport: 'Basketball', league: 'NBA',  country: 'Greece',    position: 'Forward',      fact: "Nicknamed the 'Greek Freak' for his athletic moves.",          habit: 'eats healthy meals to fuel his body.' },
    // ---- Soccer / FIFA (women) ----
    { id: 'morgan',  name: 'Alex Morgan',            sport: 'Soccer',     league: 'FIFA', country: 'USA',       position: 'Forward',      fact: 'A World Cup champion and Olympic gold medalist.',              habit: 'does speed drills to sprint past defenders.' },
    { id: 'kerr',    name: 'Sam Kerr',               sport: 'Soccer',     league: 'FIFA', country: 'Australia', position: 'Forward',      fact: 'One of the best goal-scorers in the world.',                   habit: 'practices shooting on goal every day.' },
    { id: 'marta',   name: 'Marta',                  sport: 'Soccer',     league: 'FIFA', country: 'Brazil',    position: 'Forward',      fact: 'A legend of womens soccer with magical footwork.',             habit: 'juggles the ball to improve control.' },
    { id: 'rapinoe', name: 'Megan Rapinoe',          sport: 'Soccer',     league: 'FIFA', country: 'USA',       position: 'Forward',      fact: 'A World Cup champion known for her leadership.',               habit: 'stretches to stay flexible and quick.' },
    // ---- Soccer / FIFA (men) ----
    { id: 'messi',   name: 'Lionel Messi',           sport: 'Soccer',     league: 'FIFA', country: 'Argentina', position: 'Forward',      fact: 'Won the 2022 World Cup and many top awards.',                  habit: 'practices dribbling through cones.' },
    { id: 'ronaldo', name: 'Cristiano Ronaldo',      sport: 'Soccer',     league: 'FIFA', country: 'Portugal',  position: 'Forward',      fact: 'Famous for his powerful jumping headers and fitness.',         habit: 'does jumping and core workouts.' },
    // ---- Football / NFL ----
    { id: 'mahomes', name: 'Patrick Mahomes',        sport: 'Football',   league: 'NFL',  country: 'USA',       position: 'Quarterback',  fact: 'A Super Bowl champion quarterback with amazing throws.',        habit: 'studies plays and practices accuracy.' },
    { id: 'kelce',   name: 'Travis Kelce',           sport: 'Football',   league: 'NFL',  country: 'USA',       position: 'Tight End',    fact: 'One of the best tight ends, great at catching passes.',         habit: 'runs route drills to get open.' },
    { id: 'jefferson', name: 'Justin Jefferson',     sport: 'Football',   league: 'NFL',  country: 'USA',       position: 'Wide Receiver', fact: 'Known for spectacular leaping catches.',                       habit: 'trains his hands with catching drills.' }
  ];

  const FOODS = [
    { good: { e: '🍎', n: 'Apple' },    treat: { e: '🍭', n: 'Lollipop' },  why: 'Fruit gives you natural energy to run faster!' },
    { good: { e: '💧', n: 'Water' },    treat: { e: '🥤', n: 'Soda' },      why: 'Water keeps you hydrated so you can play longer!' },
    { good: { e: '🥦', n: 'Broccoli' }, treat: { e: '🍟', n: 'Fries' },     why: 'Veggies help your body grow strong!' },
    { good: { e: '🥚', n: 'Eggs' },     treat: { e: '🍩', n: 'Donut' },     why: 'Protein helps build strong muscles!' },
    { good: { e: '🍌', n: 'Banana' },   treat: { e: '🍫', n: 'Candy' },     why: 'Bananas give long-lasting energy for the game!' },
    { good: { e: '🥛', n: 'Milk' },     treat: { e: '🧁', n: 'Cupcake' },   why: 'Milk helps build strong bones!' },
    { good: { e: '🐟', n: 'Fish' },     treat: { e: '🌭', n: 'Hot dog' },   why: 'Fish is brain food and helps you focus!' }
  ];

  const EXERCISES = [
    { e: '🤸', n: 'Jumping Jacks',   c: 'Jump and clap your hands over your head!' },
    { e: '🦵', n: 'High Knees',      c: 'Run in place with your knees up high!' },
    { e: '💪', n: 'Push-Ups',        c: 'Push up from the floor (or against a wall)!' },
    { e: '🦘', n: 'Squat Jumps',     c: 'Squat down low, then jump up high!' },
    { e: '🧍', n: 'Flamingo Balance', c: 'Stand on one foot for as long as you can!' },
    { e: '🏃', n: 'Sprint in Place', c: 'Run super fast on the spot!' },
    { e: '🙆', n: 'Arm Circles',     c: 'Make big circles with both arms!' },
    { e: '🐸', n: 'Frog Jumps',      c: 'Squat down and hop forward like a frog!' }
  ];

  const OUTDOOR = ['🚲 Ride your bike', '🏀 Shoot hoops', '⚽ Kick at a target', '🏃 Race a friend', '🪢 Jump rope', '🌳 Nature walk', '🤾 Play tag', '🏈 Play catch'];

  const GENERAL = [
    { q: 'How many players from one team are on a basketball court?', a: '5', d: ['3', '7', '11'] },
    { q: 'What do you call it when you score in soccer?', a: 'A Goal', d: ['A Touchdown', 'A Basket', 'A Home Run'] },
    { q: 'How many points is a touchdown in football?', a: '6', d: ['1', '3', '10'] },
    { q: 'How many points is a far-away shot (3-point line) in basketball?', a: '3', d: ['1', '2', '5'] },
    { q: 'How many players from one team are on a soccer field?', a: '11', d: ['5', '7', '9'] },
    { q: 'In football, scoring in the end zone is called a…', a: 'Touchdown', d: ['Goal', 'Basket', 'Ace'] },
    { q: 'Which sport uses a hoop and a bouncing ball?', a: 'Basketball', d: ['Soccer', 'Football', 'Swimming'] },
    { q: 'In which sport do you kick a ball into a net with your feet?', a: 'Soccer', d: ['Basketball', 'Football', 'Tennis'] },
    { q: 'What should champions drink lots of to stay healthy?', a: 'Water', d: ['Soda', 'Candy juice', 'Milkshakes'] }
  ];

  function makeTrivia() {
    const pool = [];
    const some = shuffle(ATHLETES.slice());
    some.slice(0, 8).forEach(a => {
      pool.push({ q: 'Which sport does ' + a.name + ' play?', a: a.sport, d: ['Basketball', 'Soccer', 'Football', 'Baseball'].filter(x => x !== a.sport) });
    });
    some.slice(0, 6).forEach(a => {
      const posD = a.sport === 'Football' ? ['Quarterback', 'Tight End', 'Wide Receiver', 'Running Back']
        : a.sport === 'Basketball' ? ['Guard', 'Forward', 'Center', 'Coach']
        : ['Forward', 'Goalkeeper', 'Defender', 'Referee'];
      pool.push({ q: 'What position does ' + a.name + ' play?', a: a.position, d: posD.filter(x => x !== a.position) });
    });
    ATHLETES.filter(a => a.sport === 'Soccer' || a.country !== 'USA').forEach(a => {
      pool.push({ q: 'Which country is ' + a.name + ' from?', a: a.country, d: ['USA', 'Argentina', 'Brazil', 'Portugal', 'Australia', 'Greece', 'England'].filter(x => x !== a.country) });
    });
    return pool.concat(GENERAL);
  }

  function todayStr() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  STEM.registerGame({
    id: 'athlete',
    title: 'Future Athlete Power',
    icon: '🏆',
    blurb: 'Train like your favorite pro!',
    category: 'Health & Sport',
    color: '#ff7a1a',
    stickerEmoji: '🥇',
    stickerName: 'Future Athlete',

    mount(stage, ctx) {
      const easy = ctx.difficulty === 'easy';
      let viewCleanup = null;
      ctx.onCleanup(() => { if (viewCleanup) viewCleanup(); });

      function go(fn) { if (viewCleanup) { viewCleanup(); viewCleanup = null; } STEM.clear(stage); fn(); }

      /* ---- player-saved state ---- */
      function player() { return STEM.store.current(); }
      function getHero() { const p = player(); return ATHLETES.find(a => a.id === (p && p.heroId)) || null; }
      function setHero(id) { STEM.store.updatePlayer(player().id, { heroId: id }); }
      function getTraining() {
        const p = player(); let t = p && p.training;
        const today = todayStr();
        if (!t || t.date !== today) t = { date: today, done: [] };
        return t;
      }
      function saveTraining(t) { STEM.store.updatePlayer(player().id, { training: t }); }

      /* ---- shared bits ---- */
      function backBar(title) {
        return el('div', { class: 'am-bar' }, [
          el('button', { class: 'pill-btn ghost small', text: '⬅ Menu', onClick: () => { ctx.sound.click(); go(menu); } }),
          el('h3', { class: 'am-h', text: title })
        ]);
      }
      function emptyHero() {
        return el('div', { class: 'am-empty' }, [
          el('div', { style: { fontSize: '3rem' }, text: '🌟' }),
          el('p', { text: 'Pick your favorite athlete first, then come back to train like them!' }),
          el('button', { class: 'pill-btn', text: '🌟 Pick an Athlete', onClick: () => go(pick) })
        ]);
      }

      /* =================== MENU =================== */
      function menu() {
        ctx.setScore('');
        const hero = getHero();
        const wrap = el('div', { class: 'am-wrap' });

        const banner = el('div', { class: 'hero-banner' });
        if (hero) {
          banner.append(
            el('span', { class: 'hb-emoji', text: SPORT_EMOJI[hero.sport] }),
            el('div', {}, [
              el('div', { class: 'hb-name', text: 'You train like ' + hero.name + '!' }),
              el('div', { class: 'hb-sub', text: hero.league + ' · ' + hero.position + ' — ' + hero.habit })
            ])
          );
        } else {
          banner.append(el('span', { class: 'hb-emoji', text: '🌟' }),
            el('div', {}, el('div', { class: 'hb-name', text: 'Pick your athlete to begin!' })));
        }
        wrap.appendChild(banner);

        const grid = el('div', { class: 'am-menu' });
        [
          { e: '🌟', t: 'Pick Your Athlete', d: 'Choose your hero', fn: pick, c: '#ff8a3d' },
          { e: '⭐', t: 'My Daily Training', d: 'Habits to level up', fn: daily, c: '#9b5cff' },
          { e: '🥗', t: 'Fuel Up!', d: 'Eat like a champ', fn: fuel, c: '#2ecc71' },
          { e: '🧠', t: 'Athlete Trivia', d: 'NFL · NBA · WNBA · FIFA', fn: trivia, c: '#3da5ff' },
          { e: '🏃', t: 'Move Like a Pro', d: 'Work out & go outside', fn: move, c: '#ff5d5d' }
        ].forEach(a => {
          const card = el('button', { class: 'am-card', onClick: () => { ctx.sound.click(); go(a.fn); } }, [
            el('span', { class: 'am-emoji', text: a.e }),
            el('span', { class: 'am-title', text: a.t }),
            el('span', { class: 'am-desc', text: a.d })
          ]);
          card.style.setProperty('--tcol', a.c);
          grid.appendChild(card);
        });
        wrap.appendChild(grid);
        stage.appendChild(wrap);
      }

      /* =================== PICK ATHLETE =================== */
      function pick() {
        stage.appendChild(backBar('Pick Your Athlete'));
        let filter = 'All';
        const tabs = el('div', { class: 'sport-tabs' });
        [['All', '⭐'], ['Basketball', '🏀'], ['Soccer', '⚽'], ['Football', '🏈']].forEach(([s, e]) => {
          const t = el('button', { class: 'sport-tab', text: e + ' ' + s, onClick: () => { filter = s; ctx.sound.pop(); render(); } });
          t._s = s; tabs.appendChild(t);
        });
        const info = el('div', { class: 'feedback' });
        const grid = el('div', { class: 'ath-grid' });
        stage.append(tabs, info, grid);

        function render() {
          tabs.querySelectorAll('.sport-tab').forEach(t => t.classList.toggle('sel', t._s === filter));
          STEM.clear(grid);
          const hero = getHero();
          ATHLETES.filter(a => filter === 'All' || a.sport === filter).forEach(a => {
            const card = el('button', { class: 'ath-card' + (hero && hero.id === a.id ? ' sel' : '') }, [
              el('span', { class: 'ath-emoji', text: SPORT_EMOJI[a.sport] }),
              el('span', { class: 'ath-name', text: a.name }),
              el('span', { class: 'ath-meta', text: a.league + ' · ' + a.position }),
              el('span', { class: 'ath-meta', text: a.country }),
              el('span', { class: 'ath-fact', text: a.fact })
            ]);
            card.addEventListener('click', () => {
              setHero(a.id); ctx.sound.good();
              info.className = 'feedback good';
              info.textContent = "🎉 You're now training like " + a.name + '!';
              render();
            });
            grid.appendChild(card);
          });
        }
        render();
      }

      /* =================== DAILY TRAINING =================== */
      function dailyItems(hero) {
        const practice = hero.sport === 'Basketball' ? { key: 'practice', emoji: '🏀', label: 'Practice ' + (easy ? 20 : 40) + ' dribbles' }
          : hero.sport === 'Soccer' ? { key: 'practice', emoji: '⚽', label: 'Do ' + (easy ? 20 : 40) + ' toe-taps on the ball' }
          : { key: 'practice', emoji: '🏈', label: 'Practice ' + (easy ? 10 : 20) + ' catches' };
        return [
          practice,
          { key: 'water', emoji: '💧', label: 'Drink ' + (easy ? 4 : 6) + ' cups of water' },
          { key: 'veggie', emoji: '🥦', label: 'Eat a fruit or veggie' },
          { key: 'outside', emoji: '🏃', label: 'Play outside for ' + (easy ? 30 : 45) + ' minutes' },
          { key: 'stretch', emoji: '🤸', label: 'Stretch & warm up' },
          { key: 'sleep', emoji: '😴', label: 'Sleep well tonight (' + (easy ? 11 : 10) + ' hours)' }
        ];
      }

      function daily() {
        stage.appendChild(backBar('My Daily Training'));
        const hero = getHero();
        if (!hero) { stage.appendChild(emptyHero()); return; }

        const t = getTraining();
        const items = dailyItems(hero);
        stage.appendChild(el('p', { class: 'q-sub', html: 'Do these every day to train like <b>' + hero.name + '</b> ' + SPORT_EMOJI[hero.sport] }));
        const list = el('div', { class: 'check-list' });
        const bar = el('div', { class: 'tk-progress' }); const fill = el('div', { class: 'tk-fill' }); bar.appendChild(fill);
        const fb = el('div', { class: 'feedback' });
        stage.append(list, bar, fb);

        function refresh() { fill.style.width = Math.round(t.done.length / items.length * 100) + '%'; ctx.setScore('✅ ' + t.done.length + '/' + items.length); }

        items.forEach(it => {
          const row = el('button', { class: 'check-row' + (t.done.includes(it.key) ? ' done' : '') }, [
            el('span', { class: 'cr-box', text: t.done.includes(it.key) ? '✅' : '⬜' }),
            el('span', { class: 'cr-emoji', text: it.emoji }),
            el('span', { class: 'cr-label', text: it.label })
          ]);
          row.addEventListener('click', () => {
            const i = t.done.indexOf(it.key);
            if (i >= 0) { t.done.splice(i, 1); row.classList.remove('done'); row.firstChild.textContent = '⬜'; }
            else { t.done.push(it.key); row.classList.add('done'); row.firstChild.textContent = '✅'; ctx.sound.pop(); }
            saveTraining(t); refresh();
            if (t.done.length === items.length) {
              ctx.sound.good(); fb.className = 'feedback good'; fb.textContent = "Amazing! You finished today's training! 🎉";
              setTimeout(() => ctx.win({ summary: 'You trained like ' + hero.name + ' today! 🏅', score: items.length }), 700);
            }
          });
          list.appendChild(row);
        });

        if (t.done.length === items.length) { fb.className = 'feedback good'; fb.textContent = "✅ Today's training is complete — come back tomorrow! 🌙"; }
        refresh();
      }

      /* =================== FUEL UP =================== */
      function fuel() {
        stage.appendChild(backBar('Fuel Up!'));
        const rounds = shuffle(FOODS.slice()).slice(0, 6);
        let i = 0, good = 0;
        const dots = el('div', { class: 'progress-dots' });
        const prompt = el('div', { class: 'q-prompt', style: { fontSize: '1.4rem' }, text: 'Which is better fuel for a champion?' });
        const grid = el('div', { class: 'choice-grid' });
        const fb = el('div', { class: 'feedback' });
        stage.append(dots, prompt, grid, fb);

        function renderDots() { STEM.clear(dots); for (let k = 0; k < 6; k++) dots.appendChild(el('span', { class: 'dot' + (k < i ? ' done' : k === i ? ' now' : '') })); }
        function next() {
          renderDots(); fb.textContent = ''; fb.className = 'feedback'; STEM.clear(grid);
          const r = rounds[i];
          shuffle([{ f: r.good, ok: true }, { f: r.treat, ok: false }]).forEach(opt => {
            const b = el('button', { class: 'choice-btn food-btn' }, [
              el('span', { class: 'food-emoji', text: opt.f.e }),
              el('span', { class: 'food-name', text: opt.f.n })
            ]);
            b.addEventListener('click', () => {
              if (b.disabled) return;
              grid.querySelectorAll('button').forEach(x => x.disabled = true);
              if (opt.ok) { b.classList.add('correct'); good++; ctx.sound.good(); fb.className = 'feedback good'; fb.textContent = '💪 ' + r.why; }
              else {
                b.classList.add('wrong'); ctx.sound.wrong(); fb.className = 'feedback try';
                fb.textContent = 'Treats are fun sometimes! But ' + r.good.n + ' gives you more power 💪';
                grid.querySelectorAll('.food-btn').forEach(x => { if (x.querySelector('.food-name').textContent === r.good.n) x.classList.add('correct'); });
              }
              i++; setTimeout(() => i >= 6 ? finish() : next(), 1400);
            });
            grid.appendChild(b);
          });
        }
        function finish() { ctx.win({ summary: 'You picked ' + good + ' power foods! Fuel up to level up! 🥗', score: good }); }
        ctx.setScore('🥗'); next();
      }

      /* =================== TRIVIA =================== */
      function trivia() {
        stage.appendChild(backBar('Athlete Trivia'));
        const qs = shuffle(makeTrivia()).slice(0, 8);
        let i = 0, stars = 0;
        const dots = el('div', { class: 'progress-dots' });
        const prompt = el('div', { class: 'q-prompt', style: { fontSize: '1.3rem' } });
        const grid = el('div', { class: 'choice-grid' });
        const fb = el('div', { class: 'feedback' });
        stage.append(dots, prompt, grid, fb);

        function renderDots() { STEM.clear(dots); for (let k = 0; k < 8; k++) dots.appendChild(el('span', { class: 'dot' + (k < i ? ' done' : k === i ? ' now' : '') })); }
        function next() {
          renderDots(); fb.textContent = ''; fb.className = 'feedback'; STEM.clear(grid);
          const q = qs[i]; let first = true;
          prompt.textContent = q.q;
          shuffle([q.a].concat(shuffle(q.d.slice()).slice(0, 3))).forEach(o => {
            const b = el('button', { class: 'choice-btn', style: { fontSize: '1.15rem' }, text: o });
            b.addEventListener('click', () => {
              if (b.disabled) return;
              if (o === q.a) {
                b.classList.add('correct'); ctx.sound.good(); fb.className = 'feedback good'; fb.textContent = STEM.msg.praise();
                if (first) { stars++; ctx.setScore('⭐ ' + stars); }
                i++; setTimeout(() => i >= 8 ? finish() : next(), 900);
              } else { first = false; b.classList.add('wrong'); b.disabled = true; ctx.sound.wrong(); fb.className = 'feedback try'; fb.textContent = STEM.msg.tryAgain(); }
            });
            grid.appendChild(b);
          });
        }
        function finish() { ctx.win({ summary: 'You scored ' + stars + ' of 8 on Athlete Trivia! 🧠', score: stars }); }
        ctx.setScore('⭐ 0'); next();
      }

      /* =================== MOVE LIKE A PRO =================== */
      function move() {
        stage.appendChild(backBar('Move Like a Pro'));
        const dur = easy ? 15 : 25;
        const circuit = shuffle(EXERCISES.slice()).slice(0, 4);

        const wrap = el('div', { class: 'am-wrap' });
        wrap.appendChild(el('p', { class: 'q-sub', text: 'Your training circuit — do each move for ' + dur + ' seconds!' }));
        const exl = el('div', { class: 'ex-list' });
        circuit.forEach(x => exl.appendChild(el('div', { class: 'ex-li' }, [el('span', { class: 'ex-li-e', text: x.e }), el('span', { text: x.n })])));
        wrap.appendChild(exl);
        wrap.appendChild(el('div', { style: { textAlign: 'center', margin: '16px 0' } },
          el('button', { class: 'pill-btn big', text: '▶️ Start Training', onClick: start })));
        wrap.appendChild(el('h4', { class: 'am-h', style: { textAlign: 'center' }, text: '🌳 Or head outside and play!' }));
        const out = el('div', { class: 'outdoor-list' });
        OUTDOOR.forEach(o => out.appendChild(el('span', { class: 'outdoor-chip', text: o })));
        wrap.appendChild(out);
        stage.appendChild(wrap);

        function start() {
          STEM.clear(stage);
          stage.appendChild(backBar('Move Like a Pro'));
          const view = el('div', { class: 'ex-stage' });
          const emoji = el('div', { class: 'ex-emoji' });
          const name = el('h2', { class: 'ex-name' });
          const cue = el('p', { class: 'ex-cue' });
          const timer = el('div', { class: 'ex-timer' });
          view.append(emoji, name, cue, timer,
            el('div', { style: { textAlign: 'center' } }, el('button', { class: 'pill-btn ghost small', text: 'Skip ➡', onClick: nextEx })));
          stage.appendChild(view);

          let idx = 0, remaining = dur, iv = null;
          viewCleanup = () => { if (iv) clearInterval(iv); };

          function show() {
            const x = circuit[idx];
            emoji.textContent = x.e; name.textContent = (idx + 1) + '. ' + x.n; cue.textContent = x.c;
            remaining = dur; timer.textContent = remaining + 's';
            ctx.setScore('🏋️ ' + (idx + 1) + '/' + circuit.length);
          }
          function tick() { remaining--; if (remaining <= 0) { ctx.sound.pop(); nextEx(); } else timer.textContent = remaining + 's'; }
          function nextEx() { if (iv) clearInterval(iv); idx++; if (idx >= circuit.length) return finish(); show(); iv = setInterval(tick, 1000); }
          function finish() { if (iv) clearInterval(iv); viewCleanup = null; ctx.win({ summary: 'Great workout! You moved like a pro! 🏃💪', score: circuit.length }); }

          show(); iv = setInterval(tick, 1000);
        }
      }

      menu();
    }
  });
})();
