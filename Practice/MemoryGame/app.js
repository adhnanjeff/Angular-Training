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
var leaderboardList = document.getElementById("leaderboard");
// Name popup
var namePopup = document.getElementById("name-popup");
var nameInput = document.getElementById("name-input");
var startGameBtn = document.getElementById("start-game");
var playerNameSpan = document.getElementById("player-name");
var playerName = "";
var moves = 0;
var firstCard = null;
var secondCard = null;
var lockBoard = false;
var matchedPairs = 0;
var icons = ["🍎", "🍌", "🍇", "🍓", "🍍", "🥝", "🍉", "🍑"];
var cards = [];
// ---------------- GAME INIT ----------------
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
            setTimeout(handleWin, 500);
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
// ---------------- LEADERBOARD ----------------
function updateLeaderboard() {
    var scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    scores.sort(function (a, b) { return a.moves - b.moves; });
    var top5 = scores.slice(0, 5);
    leaderboardList.innerHTML = "";
    top5.forEach(function (entry, index) {
        var li = document.createElement("li");
        li.textContent = "".concat(entry.name, " - ").concat(entry.moves, " moves");
        leaderboardList.appendChild(li);
    });
}
function handleWin() {
    winMessage.textContent = "".concat(playerName, ", you won in ").concat(moves, " moves!");
    // Save score
    var scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    scores.push({ name: playerName, moves: moves });
    localStorage.setItem("leaderboard", JSON.stringify(scores));
    updateLeaderboard();
    winPopup.style.display = "flex";
}
// ---------------- EVENTS ----------------
restartBtn.addEventListener("click", initGame);
closePopupBtn.addEventListener("click", initGame);
startGameBtn.addEventListener("click", function () {
    var name = nameInput.value.trim();
    if (name === "")
        return alert("Please enter your name!");
    playerName = name;
    playerNameSpan.textContent = playerName;
    namePopup.style.display = "none";
    initGame();
});
// Always show name popup on load
window.onload = function () {
    namePopup.style.display = "flex";
    updateLeaderboard(); // ✅ load leaderboard immediately
};
