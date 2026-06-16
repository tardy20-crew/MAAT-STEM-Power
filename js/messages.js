/* =========================================================
   messages.js — kind, encouraging words.
   Wrong answers are NEVER scolded — only cheered on.
   ========================================================= */
window.STEM = window.STEM || {};

STEM.msg = (function () {
  const praise = [
    'Awesome! 🌟', 'You got it! 🎉', 'Super smart! 🧠', 'Yes! High five! ✋',
    'Brilliant! ✨', 'Way to go! 🚀', 'Nailed it! 🎯', 'Woohoo! 🥳',
    'Fantastic! 🌈', 'You rock! 🤘', 'Genius! 💡', 'Amazing work! 🏆'
  ];

  const tryAgain = [
    'So close! Try again! 💪', 'Almost! You can do it! 🌱', 'Good try! Give it another go! 😊',
    'Oops! No worries, try again! 🙂', 'Keep going, you\'ve got this! ⭐',
    'Nice thinking! Try once more! 🧩', 'Every try makes you smarter! 🌟'
  ];

  const winTitles = [
    'You did it!', 'STEM Superstar!', 'Champion!', 'Mission Complete!',
    'High Five!', 'You\'re a Genius!', 'Level Cleared!'
  ];

  const winMsgs = [
    'Your brain is getting stronger every day! 🧠💪',
    'That was incredible — come back tomorrow for more! 🌟',
    'You\'re officially a STEM Star! ⭐',
    'Scientists and builders would be proud of you! 🔬🏗️',
    'Practice makes progress — and you\'re crushing it! 🚀'
  ];

  const hubGreetings = [
    'Ready for a brain adventure? 🧠', 'What will you discover today? 🔭',
    'Let\'s play and learn! 🎮', 'Time to be a STEM Star! 🌟',
    'Pick a game and shine! ✨', 'Your daily adventure awaits! 🗺️'
  ];

  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  return {
    praise: () => pick(praise),
    tryAgain: () => pick(tryAgain),
    winTitle: () => pick(winTitles),
    winMsg: () => pick(winMsgs),
    hubGreeting: () => pick(hubGreetings)
  };
})();
