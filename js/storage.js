/* =========================================================
   storage.js — saves players & progress on THIS device only.
   Nothing is ever uploaded anywhere. (See "For Grown-Ups".)
   ========================================================= */
window.STEM = window.STEM || {};

STEM.store = (function () {
  const KEY = 'stemStarClub.v1';

  function defaults() {
    return { players: [], currentId: null, soundOn: true };
  }

  let data = load();

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (!raw || typeof raw !== 'object') return defaults();
      return Object.assign(defaults(), raw);
    } catch (e) {
      return defaults();
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* private mode etc. */ }
  }

  function uid() {
    return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function isYesterday(dateStr) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yStr = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    return dateStr === yStr;
  }

  function normalizePlayer(p) {
    p.stickers = p.stickers || {};                 // { gameId: count }
    p.best = p.best || {};                          // { gameId: bestScore }
    p.streak = p.streak || { count: 0, last: null };
    p.plays = p.plays || 0;
    return p;
  }

  return {
    /* ---- players ---- */
    getPlayers() { return data.players.map(normalizePlayer); },
    getPlayer(id) { return normalizePlayer(data.players.find(p => p.id === id) || {}); },

    current() {
      if (!data.currentId) return null;
      const p = data.players.find(p => p.id === data.currentId);
      return p ? normalizePlayer(p) : null;
    },
    setCurrent(id) { data.currentId = id; save(); },

    addPlayer({ name, avatar, age }) {
      const p = normalizePlayer({ id: uid(), name: name || 'Star', avatar: avatar || '🦊', age: age || 7 });
      data.players.push(p);
      data.currentId = p.id;
      save();
      return p;
    },

    updatePlayer(id, fields) {
      const p = data.players.find(p => p.id === id);
      if (p) { Object.assign(p, fields); save(); }
      return p;
    },

    removePlayer(id) {
      data.players = data.players.filter(p => p.id !== id);
      if (data.currentId === id) data.currentId = null;
      save();
    },

    /* ---- progress ---- */
    awardSticker(gameId, n) {
      const p = this.current();
      if (!p) return 0;
      p.stickers[gameId] = (p.stickers[gameId] || 0) + (n || 1);
      save();
      return p.stickers[gameId];
    },

    saveBest(gameId, score) {
      const p = this.current();
      if (!p) return 0;
      if (!p.best[gameId] || score > p.best[gameId]) p.best[gameId] = score;
      save();
      return p.best[gameId];
    },

    totalStickers(player) {
      const p = player || this.current();
      if (!p || !p.stickers) return 0;
      return Object.values(p.stickers).reduce((a, b) => a + b, 0);
    },

    /* Updates the daily streak. Returns the streak count. */
    recordDailyPlay() {
      const p = this.current();
      if (!p) return 0;
      const today = todayStr();
      if (p.streak.last === today) {
        /* already counted today */
      } else if (isYesterday(p.streak.last)) {
        p.streak.count += 1;
        p.streak.last = today;
      } else {
        p.streak.count = 1;
        p.streak.last = today;
      }
      p.plays += 1;
      save();
      return p.streak.count;
    },

    streakCount() {
      const p = this.current();
      return p ? (p.streak.count || 0) : 0;
    },

    /* ---- sound preference ---- */
    soundOn() { return data.soundOn !== false; },
    setSoundOn(on) { data.soundOn = !!on; save(); },

    /* ---- danger ---- */
    resetAll() { data = defaults(); save(); }
  };
})();
