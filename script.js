const CELL_SIZE = 20;
const CANVAS_SIZE = 400;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
const MOVE_INTERVAL = 120;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
    realtimeScore: 0,
    level: 1,
    lives: 3,
  };
}
let snake1 = initSnake("green");

let apples = [
  {
    color: "red",
    position: initPosition(),
  },
  {
    color: "red",
    position: initPosition(),
  },
];

let heart = {
  color: "blue",
  position: initPosition(),
};

let barriers = [
  [
    {
      color: "black",
      direction: "HORIZONTAL",
      positionStart: { x: 0.3 * WIDTH, y: 0.2 * HEIGHT },
      positionEnd: { x: 0.7 * WIDTH, y: 0.2 * HEIGHT },
    },
  ],

  [
    {
      color: "black",
      direction: "HORIZONTAL",
      positionStart: { x: 0.3 * WIDTH, y: 0.2 * HEIGHT },
      positionEnd: { x: 0.7 * WIDTH, y: 0.2 * HEIGHT },
    },
    {
      color: "black",
      direction: "HORIZONTAL",
      positionStart: { x: 0.3 * WIDTH, y: 0.5 * HEIGHT },
      positionEnd: { x: 0.7 * WIDTH, y: 0.5 * HEIGHT },
    },
  ],
  [
    {
      color: "black",
      direction: "HORIZONTAL",
      positionStart: { x: 0.3 * WIDTH, y: 0.2 * HEIGHT },
      positionEnd: { x: 0.7 * WIDTH, y: 0.2 * HEIGHT },
    },
    {
      color: "black",
      direction: "HORIZONTAL",
      positionStart: { x: 0.3 * WIDTH, y: 0.5 * HEIGHT },
      positionEnd: { x: 0.7 * WIDTH, y: 0.5 * HEIGHT },
    },
    {
      color: "black",
      direction: "HORIZONTAL",
      positionStart: { x: 0.3 * WIDTH, y: 0.8 * HEIGHT },
      positionEnd: { x: 0.7 * WIDTH, y: 0.8 * HEIGHT },
    },
  ],
  [
    {
      color: "black",
      direction: "VERTICAL",
      positionStart: { x: 0.3 * WIDTH, y: 0.2 * HEIGHT },
      positionEnd: { x: 0.3 * WIDTH, y: 0.8 * HEIGHT },
    },
    {
      color: "black",
      direction: "VERTICAL",
      positionStart: { x: 0.7 * WIDTH, y: 0.2 * HEIGHT },
      positionEnd: { x: 0.7 * WIDTH, y: 0.8 * HEIGHT },
    },
  ],
  [
    {
      color: "black",
      direction: "VERTICAL",
      positionStart: { x: 0.2 * WIDTH, y: 0.2 * HEIGHT },
      positionEnd: { x: 0.2 * WIDTH, y: 0.8 * HEIGHT },
    },
    {
      color: "black",
      direction: "VERTICAL",
      positionStart: { x: 0.5 * WIDTH, y: 0.2 * HEIGHT },
      positionEnd: { x: 0.5 * WIDTH, y: 0.8 * HEIGHT },
    },
    {
      color: "black",
      direction: "VERTICAL",
      positionStart: { x: 0.8 * WIDTH, y: 0.2 * HEIGHT },
      positionEnd: { x: 0.8 * WIDTH, y: 0.8 * HEIGHT },
    },
  ],
];

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawBody(ctx, x, y, color) {
  ctx.fillStyle = color;
  var snakeBody = document.getElementById("snakeBody");
  ctx.drawImage(
    snakeBody,
    x * CELL_SIZE,
    y * CELL_SIZE,
    0.8 * CELL_SIZE,
    0.8 * CELL_SIZE
  );
}

function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById("score1Board");
  }
  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "30px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
  if (snake.realtimeScore != snake.score) {
    snake.score = snake.realtimeScore;
    if (snake.score % 5 == 0) {
      if (snake.level == 5) {
        var audio = new Audio("./assets/win.mp3");
        audio.play();
        alert(`You Win !!!`);
        snake1 = initSnake("green");
        initGame();
      } else {
        var audio = new Audio("./assets/level_up.mp3");
        audio.play();
        alert(`Level ${snake.level} Completed`);
        snake.level = snake.score / 5 + 1;
      }
    }
  }
  document.getElementById("title").innerHTML = `Snake - Level ${snake.level}`;
}

function drawSpeed(snake) {
  let speed = MOVE_INTERVAL - (snake.level - 1) * 20;
  document.getElementById("speed").innerHTML = `Speed ${speed} ms`;
}

function isPrime(number) {
  if (number === 1 || number === 0) {
    return false;
  }

  if (number > 1) {
    for (let i = 2; i < number; i++) {
      if (number % i == 0) {
        return false;
      }
    }
  }

  return true;
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    var snakeHead = document.getElementById("snakeHead");
    ctx.drawImage(
      snakeHead,
      snake1.head.x * CELL_SIZE,
      snake1.head.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
    for (let i = 1; i < snake1.body.length; i++) {
      drawBody(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
    }

    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];

      var img = document.getElementById("apple");
      ctx.drawImage(
        img,
        apple.position.x * CELL_SIZE,
        apple.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

    if (isPrime(snake1.score)) {
      var heartImage = document.getElementById("heart");
      ctx.drawImage(
        heartImage,
        heart.position.x * CELL_SIZE,
        heart.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

    for (let i = 0; i < snake1.lives; i++) {
      var img = document.getElementById("heart");
      ctx.drawImage(
        img,
        0.8 * i * CELL_SIZE + 3,
        0.8 * 3,
        0.8 * CELL_SIZE,
        0.8 * CELL_SIZE
      );
    }

    let barrierLevel = barriers[snake1.level - 1];

    for (let i = 0; i < barrierLevel.length; i++) {
      let barrier = barrierLevel[i];
      if (barrier.direction == "HORIZONTAL") {
        for (let j = barrier.positionStart.x; j < barrier.positionEnd.x; j++) {
          drawCell(ctx, j, barrier.positionStart.y, barrier.color);
        }
      } else {
        for (let j = barrier.positionStart.y; j < barrier.positionEnd.y; j++) {
          drawCell(ctx, barrier.positionStart.x, j, barrier.color);
        }
      }
    }
    drawSpeed(snake1);
    drawScore(snake1);
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = initPosition();
      snake.realtimeScore++;
      snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
  }

  if (snake.head.x == heart.position.x && snake.head.y == heart.position.y) {
    heart.position = initPosition();
    snake.lives++;
    snake.realtimeScore++;
    snake.body.push({ x: snake.head.x, y: snake.head.y });
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
}

function checkCollision(snake) {
  let barrierLevel = barriers[snake1.level - 1];

  for (let i = 0; i < barrierLevel.length; i++) {
    let barrier = barrierLevel[i];
    if (barrier.direction == "HORIZONTAL") {
      for (let j = barrier.positionStart.x; j < barrier.positionEnd.x; j++) {
        if (
          snake.head.x == Math.round(j) &&
          snake.head.y == Math.round(barrier.positionStart.y)
        ) {
          return true;
        }
      }
    } else {
      for (let j = barrier.positionStart.y; j < barrier.positionEnd.y; j++) {
        if (
          snake.head.x == Math.round(barrier.positionStart.x) &&
          snake.head.y == Math.round(j)
        ) {
          return true;
        }
      }
    }
  }

  for (let i = 1; i < snake.body.length; i++) {
    if (snake.head.x == snake.body[i].x && snake.head.y == snake.body[i].y) {
      return true;
    }
  }

  return false;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  if (!checkCollision(snake)) {
    let speed = MOVE_INTERVAL - (snake.level - 1) * 20;
    setTimeout(function () {
      move(snake);
    }, speed);
  } else {
    if (snake.lives <= 1) {
      var audio = new Audio("./assets/game-over.mp3");
      audio.play();
      alert("Game over");
      snake1 = initSnake("green");
      initGame();
    } else {
      setTimeout(function () {
        snake.head = initPosition();
        snake.body = [{ x: snake.head.x, y: snake.head.y }];
        snake.direction = initDirection();
        snake.lives--;
        move(snake);
      }, 1000);
    }
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "ArrowRight") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "ArrowUp") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "ArrowDown") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
}

initGame();
