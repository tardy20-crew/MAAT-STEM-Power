# 🌟 STEM Star Club

A bright, friendly, **Roblox-style game hub** packed with bite-sized **Science, Technology,
Engineering & Math** games for kids — built especially for a curious 8-year-old and 6-year-old.
A new "Game of the Day" and a daily streak keep them coming back to learn a little every day.

> **100% safe & private:** no ads, no chat, no sign-up, no internet required after loading.
> Names, stickers and progress are saved **only on your device** and are never uploaded.

---

## ▶️ How to play

**Just open `index.html` in any web browser.** That's it — double-click the file, or drag it
into Chrome/Safari/Edge/Firefox. Works great on a computer **or a tablet**.

1. Pick (or create) a player — choose a name, an avatar, and your age.
   *The age sets the difficulty automatically: ages ≤6 get the gentle version, 7+ get a bigger challenge.*
2. Tap a game tile and play!
3. Finish a game to earn a **sticker** 🏅 and keep your **🔥 streak** alive.

Each child can have their own profile, so the 8-year-old and 6-year-old keep separate
stickers, scores and difficulty.

---

## 🎮 The games

| Game | STEM area | What it builds |
|------|-----------|----------------|
| 🧮 **Math Blast** | Math | Addition, subtraction & (for older kids) times tables |
| 🤖 **Robot Coder** | Coding / Tech | Sequencing & algorithmic thinking — program a robot through a maze |
| 🧠 **Memory Match** | Science | Memory & focus with space, animal and nature themes |
| 🎵 **Pattern Pop** | Logic | Working memory & pattern recognition (watch-and-repeat) |
| 🔢 **Count & Tap** | Math | Counting and number sense for little ones |
| 🎨 **Color Lab** | Science | Color mixing — primary colors make secondary colors |

Every game is **encouraging by design**: wrong answers are met with cheerful "try again!"
messages — never penalties — and every finish ends in confetti. 🎉

---

## 👀 For grown-ups

Tap **"For Grown-Ups"** on the start screen to add/edit/remove players, read the safety
notes, or reset everything. There is intentionally nothing else hidden in the app: no
external links, no purchases, no data collection.

---

## 🛠️ For developers

Plain HTML/CSS/JavaScript — **no build step and no dependencies.** It runs straight from the
filesystem (`file://`) because it uses regular `<script>` tags (no ES modules / no `fetch`).

```
index.html            Page shell: all screens, modals, the celebration layer
css/styles.css        The whole look & feel
js/storage.js         Players & progress (localStorage only)
js/dom.js             Tiny DOM helpers + the game registry
js/sound.js           Web Audio sound effects (no audio files)
js/confetti.js        Canvas confetti
js/messages.js        Kind, encouraging messages
js/app.js             Controller: profiles, hub, launching games, rewards
js/games/*.js         One self-contained game per file
```

**Adding a game** — create `js/games/yourgame.js`, register it, and add a `<script>` tag in
`index.html`:

```js
STEM.registerGame({
  id: 'yourgame', title: 'Your Game', icon: '🚀', blurb: 'Short description',
  category: 'Science', color: '#3da5ff',
  stickerEmoji: '⭐', stickerName: 'Your Sticker',
  mount(stage, ctx) {
    // ctx.difficulty ('easy'|'medium'), ctx.age, ctx.player
    // ctx.setScore(text), ctx.sound, ctx.confetti, ctx.msg
    // ctx.onCleanup(fn)  -> clear your timers here
    // ctx.win({ summary, score }) -> celebrate + award the sticker
  }
});
```

Enjoy, and happy learning! 🌟
