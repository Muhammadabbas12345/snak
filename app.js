const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score"); 
const highScoreElement = document.querySelector(".high-score"); 
const controls = document.querySelectorAll(".controls i");
const playButton = document.querySelector(".play-button");
const snakeImage = document.querySelector(".snake-image");
const wrapper = document.querySelector(".wrapper");
const gameDetails = document.querySelector(".game-details");

const startGameButton = document.getElementById("start-game-button");
const settingsButton = document.getElementById("settings-button");
const cancelButton = document.getElementById("cancel-button");
const popupModal = document.getElementById("popup-modal");
const settingsSection = document.getElementById("settings-section");
const applySpeedButton = document.getElementById("apply-speed");
const speedRange = document.getElementById("speed-range");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10; 
let snakeBody = [];
let velocityX = 0, velocityY = 0; 
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;

highScoreElement.innerText = `High Score: ${highScore}`;

const showSettings = () => {
    settingsSection.style.display = "block";
}

const hideSettings = () => {
    settingsSection.style.display = "none";
}

const playGame = () => {
    wrapper.style.display = "block"; // Display the wrapper
    hidePopup(); // Hide the popup modal
    initializeGame();
}

const hidePopup = () => {
    popupModal.style.display = "none";
    snakeImage.style.display = "none"; // Show the snake image
    playButton.style.display = "block"; // Show the play button
    wrapper.style.display = "block";
}

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press Ok to replay... ");
    location.reload();
}

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
});

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = ` <div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];        
    }

    snakeBody[0] = [snakeX, snakeY];
    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }        
    }

    playBoard.innerHTML = htmlMarkup;
}

const startGame = () => {
    snakeImage.style.display = "none";
    playButton.style.display = "none";
    popupModal.style.display = "block";
}

const initializeGame = () => {
    gameOver = false;
    snakeBody = [];
    velocityX = 0;
    velocityY = 0;
    score = 0;
    highScore = localStorage.getItem("high-score") || 0;
    highScoreElement.innerText = `High Score: ${highScore}`;
    playBoard.innerHTML = "";
    snakeX = 5;
    snakeY = 10;
    changeFoodPosition();
    setIntervalId = setInterval(initGame, 125);
    document.addEventListener("keydown", changeDirection);
}

playButton.addEventListener("click", startGame);
startGameButton.addEventListener("click", playGame);
settingsButton.addEventListener("click", showSettings);
cancelButton.addEventListener("click", hidePopup);
applySpeedButton.addEventListener("click", hideSettings);
