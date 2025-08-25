const board = document.getElementById("game-board") as HTMLDivElement;
const movesElement = document.getElementById("moves") as HTMLSpanElement;
const restartBtn = document.getElementById("restart") as HTMLButtonElement;
const winPopup = document.getElementById("win-popup") as HTMLDivElement;
const winMessage = document.getElementById("win-message") as HTMLParagraphElement;
const closePopupBtn = document.getElementById("close-popup") as HTMLButtonElement;

let moves = 0;
let firstCard: HTMLDivElement | null = null;
let secondCard: HTMLDivElement | null = null;
let lockBoard = false;
let matchedPairs = 0;

const icons = ["🍎", "🍌", "🍇", "🍓", "🍍", "🥝", "🍉", "🍑"];
let cards: string[] = [];

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
      setTimeout(showWinPopup, 500);
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

function showWinPopup() {
  winMessage.textContent = `🎉 You Won in ${moves} moves! 🎉`;
  winPopup.style.display = "flex";
}

restartBtn.addEventListener("click", initGame);
closePopupBtn.addEventListener("click", initGame);

initGame();
