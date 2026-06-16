/* =========================================================
   confetti.js — a tiny canvas confetti burst for celebrations.
   ========================================================= */
window.STEM = window.STEM || {};

STEM.confetti = (function () {
  let canvas, ctx, pieces = [], running = false, rafId = null;

  const COLORS = ['#ff4f9a', '#ffd23f', '#2ecc71', '#3da5ff', '#ff8a3d', '#9b5cff', '#1dd3b0'];

  function ensure() {
    if (canvas) return;
    canvas = document.getElementById('confettiCanvas');
    if (canvas) ctx = canvas.getContext('2d');
  }

  function resize() {
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  function spawn(n) {
    const W = canvas.width;
    for (let i = 0; i < n; i++) {
      pieces.push({
        x: Math.random() * W,
        y: -20 - Math.random() * canvas.height * 0.3,
        r: 6 + Math.random() * 8,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        vx: -2 + Math.random() * 4,
        vy: 2 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
        shape: Math.random() < 0.5 ? 'rect' : 'circle'
      });
    }
  }

  function frame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      if (p.shape === 'rect') ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      else { ctx.beginPath(); ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    });
    pieces = pieces.filter(p => p.y < canvas.height + 30);
    if (pieces.length > 0) {
      rafId = requestAnimationFrame(frame);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    burst(amount) {
      ensure();
      if (!ctx) return;
      resize();
      spawn(amount || 120);
      if (!running) { running = true; rafId = requestAnimationFrame(frame); }
    },
    stop() {
      if (rafId) cancelAnimationFrame(rafId);
      running = false; pieces = [];
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
})();
