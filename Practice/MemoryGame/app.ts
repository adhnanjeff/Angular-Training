const board = document.getElementById("game-board") as HTMLDivElement;
const movesElement = document.getElementById("moves") as HTMLSpanElement;
const restartBtn = document.getElementById("restart") as HTMLButtonElement;
const winPopup = document.getElementById("win-popup") as HTMLDivElement;
const winMessage = document.getElementById("win-message") as HTMLParagraphElement;
const closePopupBtn = document.getElementById("close-popup") as HTMLButtonElement;
const leaderboardList = document.getElementById("leaderboard") as HTMLOListElement;

// Name popup
const namePopup = document.getElementById("name-popup") as HTMLDivElement;
const nameInput = document.getElementById("name-input") as HTMLInputElement;
const startGameBtn = document.getElementById("start-game") as HTMLButtonElement;
const playerNameSpan = document.getElementById("player-name") as HTMLSpanElement;

let playerName = "";
let moves = 0;
let firstCard: HTMLDivElement | null = null;
let secondCard: HTMLDivElement | null = null;
let lockBoard = false;
let matchedPairs = 0;

const icons = ["🍎", "🍌", "🍇", "🍓", "🍍", "🥝", "🍉", "🍑"];
let cards: string[] = [];

// ---------------- GAME INIT ----------------
function initGame() {
  moves = 0;
  matchedPairs = 0;
  movesElement.textContent = moves.toString();
  board.innerHTML = "";
  winPopup.style.display = "none";

  cards = [...icons, ...icons].sort(() => Math.random() - 0.5);

  cards.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = icon;
    card.textContent = "❓";
    card.addEventListener("click", handleCardClick);
    board.appendChild(card);
  });
}

function handleCardClick(this: HTMLDivElement) {
  if (lockBoard || this === firstCard || this.classList.contains("flipped")) return;

  this.textContent = this.dataset.value!;
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesElement.textContent = moves.toString();

  checkMatch();
}

function checkMatch() {
  if (firstCard!.dataset.value === secondCard!.dataset.value) {
    firstCard!.classList.add("matched");
    secondCard!.classList.add("matched");
    matchedPairs++;
    resetTurn();

    if (matchedPairs === icons.length) {
      setTimeout(handleWin, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard!.textContent = "❓";
      secondCard!.textContent = "❓";
      firstCard!.classList.remove("flipped");
      secondCard!.classList.remove("flipped");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// ---------------- LEADERBOARD ----------------
function updateLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  scores.sort((a: any, b: any) => a.moves - b.moves);
  const top5 = scores.slice(0, 5);

  leaderboardList.innerHTML = "";
  top5.forEach((entry: any, index: number) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} - ${entry.moves} moves`;
    leaderboardList.appendChild(li);
  });
}

function handleWin() {
  winMessage.textContent = `${playerName}, you won in ${moves} moves!`;

  // Save score
  const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  scores.push({ name: playerName, moves });
  localStorage.setItem("leaderboard", JSON.stringify(scores));

  updateLeaderboard();

  winPopup.style.display = "flex";
}

// ---------------- EVENTS ----------------
restartBtn.addEventListener("click", initGame);
closePopupBtn.addEventListener("click", initGame);

startGameBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (name === "") return alert("Please enter your name!");
  playerName = name;
  playerNameSpan.textContent = playerName;
  namePopup.style.display = "none";
  initGame();
});

// Always show name popup on load
window.onload = () => {
  namePopup.style.display = "flex";
  updateLeaderboard(); // ✅ load leaderboard immediately
};
