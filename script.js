const board = document.querySelector('.game-board');
const resetBtn = document.getElementById('reset-btn');
const scoreDisplay = document.getElementById('score');
const playAgainSection = document.getElementById('play-again');
const playAgainBtn = document.getElementById('play-again-btn');
const winBanner = document.getElementById('win-banner');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

let flippedCards = [];
let matched = [];
let moves = 0;
let gridCols = 4; // default Hard
let gridRows = 4;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function updateScore() {
  scoreDisplay.textContent = `Moves: ${moves}`;
}

function createCard(emoji) {
  const card = document.createElement('div');
  card.classList.add('card');

  const front = document.createElement('div');
  front.classList.add('front');
  front.textContent = '?';

  const back = document.createElement('div');
  back.classList.add('back');
  back.textContent = emoji;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', () => {
    if (
      flippedCards.length < 2 &&
      !card.classList.contains('flipped') &&
      !matched.includes(card)
    ) {
      card.classList.add('flipped');
      flippedCards.push({ card, emoji });

      if (flippedCards.length === 2) {
        moves++;
        updateScore();
        checkMatch();
      }
    }
  });

  return card;
}

function checkMatch() {
  const [first, second] = flippedCards;
  if (first.emoji === second.emoji) {
    matched.push(first.card, second.card);
    flippedCards = [];

    if (matched.length === gridCols * gridRows) {
      setTimeout(() => {
        winBanner.style.display = 'block';
        playAgainSection.style.display = 'block';
        launchConfetti();
      }, 500);
    }
  } else {
    setTimeout(() => {
      first.card.classList.remove('flipped');
      second.card.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

function initGame() {
  board.innerHTML = '';
  flippedCards = [];
  matched = [];
  moves = 0;
  updateScore();
  playAgainSection.style.display = 'none';
  winBanner.style.display = 'none';

  board.style.gridTemplateColumns = `repeat(${gridCols}, 80px)`;
  board.style.gridTemplateRows = `repeat(${gridRows}, 80px)`;

  const totalCards = gridCols * gridRows;
  const pairs = totalCards / 2;
  const baseEmojis = ['🤡','🤖','💀','🥀','👻','👽','🕸️','🎮','💗','☄️','🛋️','🩻','🃏','🧊','😭','🍔'];
  const selected = baseEmojis.slice(0, pairs);
  const emojis = [...selected, ...selected];

  const shuffled = shuffle(emojis);
  shuffled.forEach(emoji => {
    const card = createCard(emoji);
    board.appendChild(card);
  });
}

function launchConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// Difficulty buttons
difficultyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    gridCols = parseInt(btn.dataset.cols);
    gridRows = parseInt(btn.dataset.rows);

    difficultyButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    initGame();
  });
});

resetBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start game
initGame();