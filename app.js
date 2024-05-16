const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score"); 
const highScoreElement = document.querySelector(".high-score"); 
const controls = document.querySelectorAll(".controls i");
const playButton = document.querySelector(".play-button");
const snakeImage = document.querySelector(".snake-image");
const wrapper = document.querySelector(".wrapper");
const buttonContainers = document.querySelector(".button-container");
const image = document.querySelector(".image");
const startGameButton = document.getElementById("start-game-button");
const leaderButton = document.getElementById("leader-button");
const cancelButton = document.getElementById("cancel-button");
const popupModal = document.getElementById("popup-modal");
const leaderboardSection = document.getElementById("leaderboard-section");
const leaderboardTable = document.getElementById("leaderboard-table");
const leaderboardBody = document.getElementById("leaderboard-body");
const playerNameGameOver = document.getElementById("player-name-game-over");
const saveScoreButton = document.getElementById("save-score-game-over");
const gameOverScore = document.getElementById("game-over-score");
const gameOverModal = document.getElementById("game-over-modal");
const backButton = document.getElementById("back-button");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10; 
let snakeBody = [];
let velocityX = 0, velocityY = 0; 
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
let highScoreHistory = JSON.parse(localStorage.getItem("high-score-history")) || [];

highScoreElement.innerText = `High Score: ${highScore}`;

const showLeaderboard = () => {
    buttonContainers.style.display = "none";
    image.style.display = "none";
    leaderboardSection.style.display = "block";
    leaderboardTable.style.display="block";
    displayLeaderboard();
}

const hideLeaderboard = () => {
    leaderboardSection.style.display = "none";
    buttonContainers.style.display = "block";
    image.style.display = "block";
}

const playGame = () => {
    wrapper.style.display = "block"; 
    snakeImage.style.display = "none";
    popupModal.style.display = "none";
    initializeGame();
}

const hidePopup = () => {
    popupModal.style.display = "none";
    snakeImage.style.display = "block"; 
    playButton.style.display = "block"; 
    wrapper.style.display = "none";
}

const saveHighScore = (name) => {
    highScoreHistory.push({ name, score });
    localStorage.setItem("high-score-history", JSON.stringify(highScoreHistory));
}

const displayLeaderboard = () => {
    highScoreHistory.sort((a, b) => b.score - a.score);
    
    leaderboardBody.innerHTML = "";
    highScoreHistory.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${index + 1}</td><td>${item.name}</td><td>${item.score}</td>`;
        leaderboardBody.appendChild(row);
    });
}

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    showGameOverPopup();
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
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX};"></div>`;

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
        if (i === 0) {
            htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; ">
                          
                           </div>`;
        } else {
            htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]};"></div>`;
        }

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
            showGameOverPopup(); 
        }        
    }

    playBoard.innerHTML = htmlMarkup;
}

const startGame = () => {
    snakeImage.style.display = "none";
    playButton.style.display = "none";
    popupModal.style.display = "block";
}

const showGameOverPopup = () => {
    gameOverScore.innerText = `Your Score: ${score}`;
    gameOverModal.style.display = "block";
    wrapper.style.display = "none";
}

const hideGameOverPopup = () => {
    gameOverModal.style.display = "none";
}

const submitGameOverScore = () => {
    const playerName = playerNameGameOver.value.trim();
    if (playerName === "") {
        alert("Please enter your name.");
        return;
    }
    saveHighScore(playerName);
    hideGameOverPopup();
    initializeGame();
    snakeImage.style.display = "block"; 
    playButton.style.display = "block"; 
    wrapper.style.display = "none";
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
leaderButton.addEventListener("click", showLeaderboard);
cancelButton.addEventListener("click", hidePopup);
backButton.addEventListener("click", hideLeaderboard);
saveScoreButton.addEventListener("click", submitGameOverScore);
