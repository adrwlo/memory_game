const MEMORY_ITEMS = document.querySelectorAll(".memory_item");
const TIMER = document.querySelector(".timer");
const STEPS = document.querySelector('.steps');
const END_GAME_BG = document.querySelector('.end_game_background');
const END_GAME = document.querySelector('.end_game_container');
const RESTART_GAME = document.querySelector('.restart_game');

const memory_arr = [
    "😅 ",
    "😅 ",
    " 😆",
    " 😆",
    " 😂",
    " 😂",
    " 😓",
    " 😓",
    " 😍",
    " 😍",
    " 😎",
    " 😎",
];

let firstCard, secondCard;
let lockBoard = false;
let hasFlippedCard = false;
let steps = 0;
let score = 0;

//TIMER

let ms = 0,
    s = 0,
    m = 0;
let timer;

function start() {
    if (!timer) {
        timer = setInterval(run, 10);
    }
}

function run() {
    TIMER.textContent = getTimer();
    ms++;
    if (ms == 100) {
        ms = 0;
        s++;
    }
    if (s == 60) {
        s = 0;
        m++;
    }
}

function pause() {
    stopTimer();
}

function stop() {
    stopTimer();
    ms = 0;
    s = 0;
    m = 0;
    TIMER.textContent = getTimer();
}

function stopTimer() {
    clearInterval(timer);
    timer = false;
}

function getTimer() {
    return (
        (m < 10 ? "0" + m : m) +
        ":" +
        (s < 10 ? "0" + s : s) +
        ":" +
        (ms < 10 ? "0" + ms : ms)
    );
}

function restart() {
    stop();
    start();
}

function lap() {
    if (timer) {
        const li = document.createElement("li");
        li.innerText = getTimer();
        lapsContainer.appendChild(li);
    }
}

function resetLaps() {
    lapsContainer.innerHTML = "";
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

function completeCards(shuffled_arr) {
    let i = 0;

    while (i < shuffled_arr.length) {
        MEMORY_ITEMS.forEach((memory_item) => {
            memory_item.dataset.value = shuffled_arr[i];
            i++;
        });
    }
}

completeCards(shuffle(memory_arr));

function flipCard() {
    start();

    if (lockBoard) return;
    if (this === firstCard) return;

    if (!hasFlippedCard) {
        //first click
        hasFlippedCard = true;
        firstCard = this;
        this.innerHTML = '<p class="flippedCard">' + this.dataset.value + '</p>';
        return;
    }

    // second click
    secondCard = this;
    this.innerHTML = '<p class="flippedCard">' + this.dataset.value + '</p>';
    steps++;
    STEPS.innerHTML = steps;

    checkPairs();

    if (score === 6) {
        const final_time = getTimer();
        stop();
        displayScore(final_time, steps)
    }
}

function checkPairs() {
    console.log(firstCard);
    console.log(secondCard);
    let isPair = firstCard.dataset.value === secondCard.dataset.value;

    isPair ? disableCards() : unFlipCards();
}

function disableCards() {
    score++;
    console.log(score)
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    console.log("win");
    resetBoard();
}

function unFlipCards() {
    console.log("lose");
    lockBoard = true;

    setTimeout(() => {
        firstCard.innerHTML = "<p class='question-mark'>?</p>";
        secondCard.innerHTML = "<p class='question-mark'>?</p>";
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function displayScore(time, steps) {
    END_GAME_BG.classList.add('active');
    END_GAME.classList.add('active');
    let score = `<h2>Gratulacje!</h2>
    <p>Twoja gra trwała ${time} w ${steps} ruchach</p>
    <button class="restart_game" onClick="window.location.reload();">Zagraj ponownie!</button>`

    END_GAME.innerHTML = score;
}

MEMORY_ITEMS.forEach((memory_item) =>
    memory_item.addEventListener("click", flipCard)
);
