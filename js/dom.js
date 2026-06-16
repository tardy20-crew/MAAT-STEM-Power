/* =========================================================
   dom.js — tiny helpers used by all the games.
   ========================================================= */
window.STEM = window.STEM || {};

/* Build an element: STEM.el('button', {class:'x', text:'Hi', onClick:fn}, [children]) */
STEM.el = function (tag, props, kids) {
  const e = document.createElement(tag);
  if (props) for (const k in props) {
    const v = props[k];
    if (v == null) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k.slice(0, 2) === 'on' && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  }
  if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(c => {
    if (c == null) return;
    e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  });
  return e;
};

STEM.clear = function (node) { while (node && node.firstChild) node.removeChild(node.firstChild); };

STEM.shuffle = function (a) {
  for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

STEM.rand = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };

/* The game registry. Each game file pushes its definition here. */
STEM.games = STEM.games || [];
STEM.registerGame = function (def) { STEM.games.push(def); };
