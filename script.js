import Ball from "./Ball.js"
import Paddle from "./Paddle.js"


const gameBoard = document.getElementById("game-board");
const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const cpuPaddle = new Paddle(document.getElementById("cpu-paddle"))
const playerScoreElem = document.getElementById("player-score")
const cpuScoreElem = document.getElementById("cpu-score")
const controls = document.getElementById("controls")
const message = document.getElementById("message")
const startButton = document.getElementById("start-button")

let isGameStarted = false;
let lastTime;
let playerScore = 0;
let cpuScore = 0;
let rounds = 0;
let winner;
const maxRounds = 5;

function update(time) {
    if (lastTime != null && isGameStarted) {
        const delta = time - lastTime
        ball.update(delta, [playerPaddle.rect(), cpuPaddle.rect()])

        cpuPaddle.update(delta, ball.x)

        const hue = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--hue")
        )
      
        document.documentElement.style.setProperty("--hue", hue + delta * 0.01)

        if (isLose()) handleLose()
    }

    lastTime = time
    window.requestAnimationFrame(update)
}

function isLose() {
    const rect = ball.rect()
    return rect.bottom >= window.innerHeight || rect.top <= 91
}

function handleLose() {
    const rect = ball.rect()


    if (rect.bottom >= window.innerHeight) {
        cpuScore++
    } else {
        playerScore++
    }

    updateScore(playerScore, cpuScore)
    setWinner(playerScore, cpuScore)
    rounds++;

    if (rounds >= maxRounds) {
        isGameStarted = false;
        controls.style.visibility = "visible"
        message.innerHTML = `
            <h3>GAME OVER</h3>
            <p>The winner is ${winner}</p>
        `
        startButton.textContent = "Play again!"
        startButton.addEventListener("click", () => {
            startGame();
        });
    } else {
        ball.reset();
    }

    ball.reset()
}

function startGame() {
    resetGame();
    isGameStarted = true;
    controls.style.visibility = "hidden"
    window.requestAnimationFrame(update);
}

function resetGame() {
    playerScore = 0;
    cpuScore = 0;
    rounds = 0;
    ball.reset();
    playerPaddle.reset();
    cpuPaddle.reset();
    updateScore(playerScore, cpuScore)
    lastTime = null;
}

function updateScore(player, cpu) {
    playerScoreElem.textContent = player;
    cpuScoreElem.textContent = cpu;
}

function setWinner(player, cpu) {
    if (player > cpu) {
        winner = "PLAYER"
    } else {
        winner = "CPU"
    }
}

document.addEventListener("mousemove", e => {
    playerPaddle.position = (e.x / window.innerWidth) * 100
})

startButton.addEventListener("click", () => {
    startGame();
})

