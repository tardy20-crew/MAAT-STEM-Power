/* =========================================================
   sound.js — gentle, friendly sound effects.
   Uses the Web Audio API so there are NO sound files to load.
   ========================================================= */
window.STEM = window.STEM || {};

STEM.sound = (function () {
  let ctx = null;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* play a single soft tone */
  function tone(freq, start, dur, type, gainPeak) {
    const a = ac();
    if (!a) return;
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    const t = a.currentTime + start;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(gainPeak || 0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(a.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function enabled() { return STEM.store.soundOn(); }

  const A = {
    /* call once after a user gesture so audio can start on mobile */
    unlock() { ac(); },

    click() { if (enabled()) tone(440, 0, 0.08, 'triangle', 0.12); },

    good() {
      if (!enabled()) return;
      tone(659.25, 0, 0.12, 'sine', 0.16);   // E5
      tone(987.77, 0.1, 0.16, 'sine', 0.16); // B5
    },

    wrong() {
      if (!enabled()) return;
      tone(196, 0, 0.18, 'sine', 0.14);      // gentle, never harsh
      tone(164.81, 0.12, 0.2, 'sine', 0.12);
    },

    pop() { if (enabled()) tone(523.25 + Math.random() * 200, 0, 0.09, 'triangle', 0.13); },

    /* a single sustained note (used by Pattern Pop) */
    note(freq, dur) { if (enabled()) tone(freq, 0, dur || 0.32, 'sine', 0.17); },

    /* happy little fanfare for finishing a game */
    win() {
      if (!enabled()) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((f, i) => tone(f, i * 0.13, 0.22, 'triangle', 0.16));
      tone(1318.5, 0.55, 0.4, 'sine', 0.14);
    }
  };

  return A;
})();
