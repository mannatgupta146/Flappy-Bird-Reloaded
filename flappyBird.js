"use strict";

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// load images
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// variables
var gap = 85;
var constant;
var bX = 10;
var bY = 150;
var gravity = 1.5;
var score = 0;
var isGameOver = false;

// audio files
var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

// DOM elements
var gameOverScreen = document.getElementById("game-over");
var finalScore = document.getElementById("final-score");
var restartButton = document.getElementById("restart");

// on key down
document.addEventListener("keydown", moveUp);

function moveUp() {
  if (!isGameOver) {
    bY -= 25;
    fly.play();
  }
}

// pipe coordinates
var pipe = [];

pipe[0] = {
  x: cvs.width,
  y: 0,
};

// draw images
function draw() {
  if (isGameOver) return;

  ctx.drawImage(bg, 0, 0);

  for (var i = 0; i < pipe.length; i++) {
    constant = pipeNorth.height + gap;

    ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

    pipe[i].x--;

    // Add new pipe
    if (pipe[i].x == 125) {
      pipe.push({
        x: cvs.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
      });
    }

    // Remove off-screen pipes
    if (pipe[i].x + pipeNorth.width < 0) {
      pipe.shift();
    }

    // detect collision
    if (
      (bX + bird.width >= pipe[i].x &&
        bX <= pipe[i].x + pipeNorth.width &&
        (bY <= pipe[i].y + pipeNorth.height ||
          bY + bird.height >= pipe[i].y + constant)) ||
      bY + bird.height >= cvs.height - fg.height
    ) {
      gameOver();
    }

    if (pipe[i].x == 5) {
      score++;
      scor.play();
    }
  }

  ctx.drawImage(fg, 0, cvs.height - fg.height);
  ctx.drawImage(bird, bX, bY);

  bY += gravity;
  ctx.fillStyle = "#000";
  ctx.font = "20px Verdana";
  ctx.fillText("Score : " + score, 10, cvs.height - 20);
  requestAnimationFrame(draw);
}

function gameOver() {
  isGameOver = true;
  gameOverScreen.classList.remove("hidden");
  finalScore.textContent = score;
}

restartButton.addEventListener("click", function () {
  location.reload();
});

draw();
