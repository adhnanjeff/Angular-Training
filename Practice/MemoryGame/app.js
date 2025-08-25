var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var board = document.getElementById("game-board");
var movesElement = document.getElementById("moves");
var restartBtn = document.getElementById("restart");
var winPopup = document.getElementById("win-popup");
var winMessage = document.getElementById("win-message");
var closePopupBtn = document.getElementById("close-popup");
var moves = 0;
var firstCard = null;
var secondCard = null;
var lockBoard = false;
var matchedPairs = 0;
var icons = ["🍎", "🍌", "🍇", "🍓", "🍍", "🥝", "🍉", "🍑"];
var cards = [];
function initGame() {
    moves = 0;
    matchedPairs = 0;
    movesElement.textContent = moves.toString();
    board.innerHTML = "";
    winPopup.style.display = "none";
    cards = __spreadArray(__spreadArray([], icons, true), icons, true).sort(function () { return Math.random() - 0.5; });
    cards.forEach(function (icon) {
        var card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = icon;
        card.textContent = "❓";
        card.addEventListener("click", handleCardClick);
        board.appendChild(card);
    });
}
function handleCardClick() {
    if (lockBoard || this === firstCard || this.classList.contains("flipped"))
        return;
    this.textContent = this.dataset.value;
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
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedPairs++;
        resetTurn();
        if (matchedPairs === icons.length) {
            setTimeout(showWinPopup, 500);
        }
    }
    else {
        lockBoard = true;
        setTimeout(function () {
            firstCard.textContent = "❓";
            secondCard.textContent = "❓";
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetTurn();
        }, 1000);
    }
}
function resetTurn() {
    var _a;
    _a = [null, null, false], firstCard = _a[0], secondCard = _a[1], lockBoard = _a[2];
}
function showWinPopup() {
    winMessage.textContent = "\uD83C\uDF89 You Won in ".concat(moves, " moves! \uD83C\uDF89");
    winPopup.style.display = "flex";
}
restartBtn.addEventListener("click", initGame);
closePopupBtn.addEventListener("click", initGame);
initGame();
