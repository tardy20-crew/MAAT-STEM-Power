/* =========================================================
   app.js — the MAAT STEM Power controller.
   Handles players, the game hub, launching games and rewards.
   ========================================================= */
(function () {
  const store = STEM.store;
  const games = STEM.games;

  const AVATARS = ['🦊', '🐱', '🐶', '🦄', '🐼', '🐯', '🐸', '🦁', '🐵', '🐧', '🐙', '🦋', '🐢', '🐝', '🦉', '🐬', '🐲', '🦖'];
  const AGES = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  /* ---------- element shortcuts ---------- */
  const $ = id => document.getElementById(id);
  const topbar = $('topbar');
  const gameStage = $('gameStage');
  const gameScore = $('gameScore');

  let cleanups = [];
  let currentGame = null;
  let editId = null, editAvatar = AVATARS[0], editAge = 7;

  /* ---------- screen + topbar ---------- */
  function show(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === screenId));
    topbar.hidden = (screenId === 'screen-players');
    window.scrollTo(0, 0);
  }

  function updateChip() {
    const p = store.current();
    if (!p) return;
    $('chipAvatar').textContent = p.avatar;
    $('chipName').textContent = p.name;
    $('streakCount').textContent = p.streak.count || 0;
  }

  // age -> learning tier (drives how hard each game gets)
  function tierFor(age) {
    if (age <= 7) return 'easy';
    if (age <= 10) return 'medium';
    if (age <= 14) return 'hard';
    return 'expert';
  }
  // keep older games working: they only distinguish 'easy' vs not
  function difficultyFor(age) { return tierFor(age) === 'easy' ? 'easy' : 'medium'; }

  // juniors vs teens — defaults from age, can be toggled per player
  function modeFor(p) { return p.mode || (p.age >= 11 ? 'teens' : 'juniors'); }
  function applyTheme(mode) { document.body.classList.toggle('teen', mode === 'teens'); }

  // which games show for a mode (audience: 'all' | 'juniors' | 'teens'; default 'all')
  function gamesFor(mode) { return games.filter(g => (g.audience || 'all') === 'all' || g.audience === mode); }

  /* ============================================================
     PLAYERS SCREEN
     ============================================================ */
  function renderPlayers() {
    const grid = $('playerGrid');
    STEM.clear(grid);
    store.getPlayers().forEach(p => {
      const card = STEM.el('button', { class: 'player-card' }, [
        STEM.el('span', { class: 'pc-avatar', text: p.avatar }),
        STEM.el('span', { class: 'pc-name', text: p.name }),
        STEM.el('span', { class: 'pc-age', text: 'Age ' + p.age + ' · 🏅 ' + store.totalStickers(p) })
      ]);
      card.addEventListener('click', () => { STEM.sound.unlock(); selectPlayer(p.id); });
      grid.appendChild(card);
    });

    const add = STEM.el('button', { class: 'player-card add' }, [
      STEM.el('span', { class: 'pc-avatar', text: '➕' }),
      STEM.el('span', { class: 'pc-name', text: 'Add Player' })
    ]);
    add.addEventListener('click', () => openEdit(null));
    grid.appendChild(add);
  }

  function selectPlayer(id) {
    store.setCurrent(id);
    updateChip();
    goHub();
  }

  /* ============================================================
     HUB
     ============================================================ */
  function dailyGame(list) {
    const pool = (list && list.length) ? list : games;
    const d = new Date();
    const n = d.getFullYear() * 366 + (d.getMonth() * 31) + d.getDate();
    return pool[n % pool.length];
  }

  function goHub() {
    show('screen-hub');
    renderHub();
  }

  function renderModeBar(mode) {
    const bar = $('modeBar');
    if (!bar) return;
    STEM.clear(bar);
    [['juniors', '🧒 Juniors', 'Ages 5–10'], ['teens', '🧑 Teens', 'Ages 11–18']].forEach(([m, label, sub]) => {
      const btn = STEM.el('button', { class: 'mode-opt' + (m === mode ? ' sel' : '') }, [
        STEM.el('span', { class: 'mo-label', text: label }),
        STEM.el('span', { class: 'mo-sub', text: sub })
      ]);
      btn.addEventListener('click', () => {
        const p = store.current();
        store.updatePlayer(p.id, { mode: m });
        STEM.sound.click();
        renderHub();
      });
      bar.appendChild(btn);
    });
  }

  function renderHub() {
    const p = store.current();
    if (!p) { show('screen-players'); return; }
    updateChip();

    $('helloName').textContent = 'Hi ' + p.name + '! ' + p.avatar;
    $('helloMsg').textContent = STEM.msg.hubGreeting();

    // juniors / teens mode + theme
    const mode = modeFor(p);
    applyTheme(mode);
    renderModeBar(mode);
    const visibleGames = gamesFor(mode);

    // game of the day
    const dg = dailyGame(visibleGames);
    const inner = $('dailyGameInner');
    STEM.clear(inner);
    inner.appendChild(STEM.el('span', { class: 'dg-icon', text: dg.icon }));
    inner.appendChild(STEM.el('div', { class: 'dg-text' }, [
      STEM.el('h3', { text: dg.title }),
      STEM.el('p', { text: dg.blurb })
    ]));
    const playBtn = STEM.el('div', { class: 'daily-play' }, STEM.el('span', { class: 'pill-btn small', text: '▶️ Play now' }));
    inner.parentElement.onclick = () => launchGame(dg);
    inner.appendChild(playBtn);

    // all games (filtered for this mode)
    const grid = $('gameGrid');
    STEM.clear(grid);
    visibleGames.forEach(g => {
      const tile = STEM.el('button', { class: 'game-tile' });
      tile.style.setProperty('--tcol', g.color);
      tile.appendChild(STEM.el('span', { class: 'gt-cat', text: g.category }));
      tile.appendChild(STEM.el('span', { class: 'gt-icon', text: g.icon }));
      tile.appendChild(STEM.el('span', { class: 'gt-title', text: g.title }));
      tile.appendChild(STEM.el('span', { class: 'gt-blurb', text: g.blurb }));
      if (p.stickers[g.id]) tile.appendChild(STEM.el('span', { class: 'gt-done', text: '⭐' }));
      tile.addEventListener('click', () => launchGame(g));
      grid.appendChild(tile);
    });

    $('trophyCount').textContent = store.totalStickers(p);
  }

  /* ============================================================
     RUNNING A GAME
     ============================================================ */
  function runCleanups() { cleanups.forEach(fn => { try { fn(); } catch (e) {} }); cleanups = []; }

  function launchGame(game) {
    STEM.sound.unlock();
    currentGame = game;
    runCleanups();
    STEM.confetti.stop();
    STEM.clear(gameStage);
    $('gameTitle').textContent = game.icon + ' ' + game.title;
    gameScore.textContent = '';

    // count today's play towards the streak
    store.recordDailyPlay();
    updateChip();

    const p = store.current();
    applyTheme(modeFor(p));
    const ctx = {
      player: p,
      age: p.age,
      difficulty: difficultyFor(p.age),
      tier: tierFor(p.age),
      mode: modeFor(p),
      sound: STEM.sound,
      confetti: STEM.confetti,
      msg: STEM.msg,
      setScore(t) { gameScore.textContent = t; },
      onCleanup(fn) { cleanups.push(fn); },
      win(opts) { finishGame(opts || {}); }
    };

    show('screen-game');
    try {
      game.mount(gameStage, ctx);
    } catch (e) {
      gameStage.appendChild(STEM.el('p', { text: 'Oops, this game had a hiccup. Try another one! 🙂' }));
      console.error(e);
    }
  }

  function leaveGame() {
    runCleanups();
    STEM.confetti.stop();
    STEM.clear(gameStage);
    hideCelebrate();
  }

  /* ============================================================
     CELEBRATION + REWARDS
     ============================================================ */
  function finishGame(opts) {
    const g = currentGame;
    const newCount = store.awardSticker(g.id, 1);
    if (typeof opts.score === 'number') store.saveBest(g.id, opts.score);
    updateChip();

    STEM.sound.win();
    STEM.confetti.burst(160);

    $('celebrateEmoji').textContent = g.stickerEmoji || '🎉';
    $('celebrateTitle').textContent = STEM.msg.winTitle();
    $('celebrateMsg').textContent = opts.summary || STEM.msg.winMsg();

    const reward = $('celebrateReward');
    STEM.clear(reward);
    reward.appendChild(STEM.el('span', { class: 'big-sticker', text: g.stickerEmoji || '🏅' }));
    reward.appendChild(STEM.el('span', {
      html: 'You earned the <strong>' + g.stickerName + '</strong> sticker!' +
            (newCount > 1 ? ' (×' + newCount + ')' : '')
    }));

    $('celebrateLayer').hidden = false;
  }

  function hideCelebrate() {
    $('celebrateLayer').hidden = true;
    STEM.confetti.stop();
  }

  /* ============================================================
     MODALS
     ============================================================ */
  function openModal(id) { $(id).hidden = false; }
  function closeModal(id) { $(id).hidden = true; }

  function renderTrophies() {
    const p = store.current();
    const shelf = $('stickerShelf');
    STEM.clear(shelf);
    const total = store.totalStickers(p);
    $('trophySub').textContent = total > 0
      ? 'You have collected ' + total + ' sticker' + (total === 1 ? '' : 's') + '! Keep going! 🌟'
      : 'Play games to collect shiny stickers!';
    games.forEach(g => {
      const count = (p.stickers && p.stickers[g.id]) || 0;
      const st = STEM.el('div', { class: 'sticker' + (count ? '' : ' locked') }, [
        STEM.el('div', { class: 'st-emoji', text: count ? g.stickerEmoji : '🔒' }),
        STEM.el('div', { class: 'st-name', text: g.stickerName }),
        STEM.el('div', { class: 'st-count', text: count ? '×' + count : 'Locked' })
      ]);
      shelf.appendChild(st);
    });
  }

  function renderParentPlayers() {
    const wrap = $('parentPlayers');
    STEM.clear(wrap);
    const list = store.getPlayers();
    if (list.length === 0) { wrap.appendChild(STEM.el('p', { text: 'No players yet.' })); return; }
    list.forEach(p => {
      const row = STEM.el('div', { class: 'parent-player-row' }, [
        STEM.el('span', { class: 'pp-av', text: p.avatar }),
        STEM.el('span', { class: 'pp-name', text: p.name + ' (age ' + p.age + ')' }),
        STEM.el('button', { class: 'pill-btn ghost small', text: '✏️ Edit', onClick: () => { closeModal('parentModal'); openEdit(p); } }),
        STEM.el('button', { class: 'pill-btn danger small', text: '🗑️', onClick: () => {
          store.removePlayer(p.id);
          renderParentPlayers(); renderPlayers();
        } })
      ]);
      wrap.appendChild(row);
    });
  }

  /* ---------- edit / add player ---------- */
  function openEdit(player) {
    editId = player ? player.id : null;
    editAvatar = player ? player.avatar : AVATARS[STEM.rand(0, AVATARS.length - 1)];
    editAge = player ? player.age : 7;
    $('editTitle').textContent = player ? 'Edit Player' : 'New Player';
    $('editName').value = player ? player.name : '';

    const ap = $('avatarPicker');
    STEM.clear(ap);
    AVATARS.forEach(a => {
      const b = STEM.el('button', { class: 'avatar-opt' + (a === editAvatar ? ' sel' : ''), text: a });
      b.addEventListener('click', () => {
        editAvatar = a;
        ap.querySelectorAll('.avatar-opt').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        STEM.sound.pop();
      });
      ap.appendChild(b);
    });

    const gp = $('agePicker');
    STEM.clear(gp);
    AGES.forEach(age => {
      const b = STEM.el('button', { class: 'age-opt' + (age === editAge ? ' sel' : ''), text: String(age) });
      b.addEventListener('click', () => {
        editAge = age;
        gp.querySelectorAll('.age-opt').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        STEM.sound.pop();
      });
      gp.appendChild(b);
    });

    openModal('editModal');
    setTimeout(() => $('editName').focus(), 50);
  }

  function savePlayer() {
    const name = ($('editName').value || '').trim() || 'Star';
    if (editId) {
      store.updatePlayer(editId, { name, avatar: editAvatar, age: editAge });
      closeModal('editModal');
      renderPlayers();
    } else {
      store.addPlayer({ name, avatar: editAvatar, age: editAge }); // becomes current
      closeModal('editModal');
      renderPlayers();
      updateChip();
      goHub();
    }
  }

  /* ============================================================
     WIRING
     ============================================================ */
  function wire() {
    $('homeBtn').addEventListener('click', () => { leaveGame(); goHub(); });
    $('backToHub').addEventListener('click', () => { leaveGame(); goHub(); });
    $('switchPlayer').addEventListener('click', () => { leaveGame(); show('screen-players'); renderPlayers(); });
    $('playerChip').addEventListener('click', () => { leaveGame(); show('screen-players'); renderPlayers(); });

    $('openTrophies').addEventListener('click', () => { renderTrophies(); openModal('trophyModal'); });
    $('trophyMini').addEventListener('click', () => { renderTrophies(); openModal('trophyModal'); });
    $('openParents').addEventListener('click', () => { renderParentPlayers(); openModal('parentModal'); });

    $('savePlayer').addEventListener('click', savePlayer);
    $('cancelPlayer').addEventListener('click', () => closeModal('editModal'));
    $('editName').addEventListener('keydown', e => { if (e.key === 'Enter') savePlayer(); });

    $('resetAll').addEventListener('click', () => {
      if (confirm('This will erase all players and stickers on this device. Are you sure?')) {
        store.resetAll();
        closeModal('parentModal');
        renderPlayers();
        show('screen-players');
      }
    });

    // sound toggle
    const soundBtn = $('soundBtn');
    function refreshSound() { soundBtn.textContent = store.soundOn() ? '🔊' : '🔇'; }
    soundBtn.addEventListener('click', () => { store.setSoundOn(!store.soundOn()); refreshSound(); STEM.sound.unlock(); STEM.sound.click(); });
    refreshSound();

    // close buttons + backdrop clicks for every modal
    document.querySelectorAll('[data-close-modal]').forEach(btn =>
      btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal'))));
    document.querySelectorAll('.modal-backdrop').forEach(bd =>
      bd.addEventListener('click', e => { if (e.target === bd) bd.hidden = true; }));

    // celebration buttons
    $('celebratePlayAgain').addEventListener('click', () => { hideCelebrate(); leaveGame(); launchGame(currentGame); });
    $('celebrateHome').addEventListener('click', () => { hideCelebrate(); leaveGame(); goHub(); });
  }

  /* ============================================================
     START
     ============================================================ */
  function init() {
    wire();
    renderPlayers();
    show('screen-players');
    // first tap anywhere unlocks audio on mobile
    document.body.addEventListener('pointerdown', () => STEM.sound.unlock(), { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
