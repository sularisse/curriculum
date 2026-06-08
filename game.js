const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const messageEl = document.getElementById('message');
const startBtn = document.getElementById('start');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const speed = 120;
const bestKey = 'snake-best-score';

let snake;
let direction;
let nextDirection;
let food;
let score;
let loopId;
let running = false;

const bestScore = Number(localStorage.getItem(bestKey) || 0);
bestEl.textContent = bestScore;

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = '0';
  food = placeFood();
  messageEl.textContent = 'Eat the food. Avoid the walls and yourself.';
}

function placeFood() {
  while (true) {
    const candidate = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    if (!snake.some(segment => segment.x === candidate.x && segment.y === candidate.y)) {
      return candidate;
    }
  }
}

function drawCell(x, y, color, radius = 4) {
  const padding = 2;
  const size = gridSize - padding * 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x * gridSize + padding, y * gridSize + padding, size, size, radius);
  ctx.fill();
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < tileCount; x++) {
    for (let y = 0; y < tileCount; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#0f172a' : '#111827';
      ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
  }

  drawCell(food.x, food.y, '#ef4444', 999);
  snake.forEach((segment, index) => {
    drawCell(segment.x, segment.y, index === 0 ? '#22c55e' : '#86efac');
  });
}

function endGame() {
  running = false;
  clearInterval(loopId);
  const currentBest = Number(localStorage.getItem(bestKey) || 0);
  if (score > currentBest) {
    localStorage.setItem(bestKey, String(score));
    bestEl.textContent = String(score);
  }
  messageEl.textContent = `Game over. Final score: ${score}. Press Start to play again.`;
}

function tick() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  const hitWall = head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount;
  const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);
  if (hitWall || hitSelf) {
    endGame();
    drawBoard();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreEl.textContent = String(score);
    food = placeFood();
  } else {
    snake.pop();
  }

  drawBoard();
}

function startGame() {
  clearInterval(loopId);
  resetGame();
  drawBoard();
  running = true;
  loopId = setInterval(tick, speed);
}

function setDirection(x, y) {
  if (x !== 0 && direction.x === -x) return;
  if (y !== 0 && direction.y === -y) return;
  nextDirection = { x, y };
}

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(key)) {
    event.preventDefault();
  }

  if (key === 'arrowup' || key === 'w') setDirection(0, -1);
  if (key === 'arrowdown' || key === 's') setDirection(0, 1);
  if (key === 'arrowleft' || key === 'a') setDirection(-1, 0);
  if (key === 'arrowright' || key === 'd') setDirection(1, 0);
  if (key === ' ' && !running) startGame();
});

startBtn.addEventListener('click', startGame);
resetGame();
drawBoard();
