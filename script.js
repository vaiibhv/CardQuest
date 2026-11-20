const cardValues = [
    "A|♠", "K|♥", "Q|♦", "J|♣",
    "10|♠", "9|♥", "8|♦", "7|♣"
];

let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let matches = 0;
let seconds = 0;

let timerInterval = null;
let gameStarted = false;

const cardGrid = document.getElementById("cardGrid");

const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const matchesDisplay = document.getElementById("matches");

const message = document.getElementById("message");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");


// Shuffle Cards
function shuffleCards() {

    cards = [...cardValues, ...cardValues];

    cards.sort(() => Math.random() - 0.5);

}


// Create Cards
function createCards() {

    cardGrid.innerHTML = "";

    cards.forEach((value) => {

        const card = document.createElement("div");

        card.classList.add("card", "hidden");

        card.dataset.value = value;

        card.addEventListener("click", flipCard);

        cardGrid.appendChild(card);

    });

}


// Show Card
function showCard(card) {

    let parts = card.dataset.value.split("|");

    let rank = parts[0];

    let suit = parts[1];

    let color = (suit === "♥" || suit === "♦")
        ? "red"
        : "black";

    card.classList.remove("hidden");

    card.classList.add(color);

    card.innerHTML = `
        <span class="rank">${rank}</span>
        <span class="suit">${suit}</span>
    `;

}


// Flip Card
function flipCard() {

    if (lockBoard) {
        return;
    }

    if (this.classList.contains("matched")) {
        return;
    }

    if (this === firstCard) {
        return;
    }

    if (!gameStarted) {

        startTimer();

        gameStarted = true;

    }

    showCard(this);

    if (firstCard === null) {

        firstCard = this;

        return;

    }

    secondCard = this;

    moves++;

    movesDisplay.textContent = moves;

    checkMatch();

}


// Check Matching
function checkMatch() {

    let isMatch =
        firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {

        disableCards();

    } else {

        unflipCards();

    }

}


// Matched Cards
function disableCards() {

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");

    matches++;

    matchesDisplay.textContent = matches + " / 8";

    resetCards();

    if (matches === 8) {

        endGame();

    }

}


// Hide Unmatched Cards
function unflipCards() {

    lockBoard = true;

    setTimeout(() => {

        firstCard.classList.add("hidden");

        secondCard.classList.add("hidden");

        firstCard.classList.remove("red", "black");

        secondCard.classList.remove("red", "black");

        firstCard.innerHTML = "";

        secondCard.innerHTML = "";

        resetCards();

    }, 1000);

}


// Reset Cards
function resetCards() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


// Start Timer
function startTimer() {

    if (timerInterval !== null) {
        return;
    }

    timerInterval = setInterval(() => {

        seconds++;

        let minutes = Math.floor(seconds / 60);

        let remainingSeconds = seconds % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(remainingSeconds).padStart(2, "0");

    }, 1000);

}


// Stop Timer
function stopTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

}


// End Game
function endGame() {

    stopTimer();

    lockBoard = true;

    message.textContent =
        "Congratulations! You completed the game!";

}


// Restart Game
function restartGame() {

    stopTimer();

    moves = 0;

    matches = 0;

    seconds = 0;

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    gameStarted = false;

    movesDisplay.textContent = "0";

    timerDisplay.textContent = "00:00";

    matchesDisplay.textContent = "0 / 8";

    message.textContent = "Find all matching pairs!";

    shuffleCards();

    createCards();

}


// Start Button
startBtn.addEventListener("click", function() {

    restartGame();

    message.textContent = "Game Started! Good Luck!";

});


// Restart Button
restartBtn.addEventListener("click", restartGame);


// Load Game
restartGame();
