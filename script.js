const score = document.querySelector(".score");
const startscreen = document.querySelector(".startscreen");
const btn = document.querySelectorAll(".btn");
const gameArea = document.querySelector(".gameArea");
var bgAudio = new Audio("bg.mp3");
var crashAudio = new Audio("crash.mp3");

startscreen.addEventListener("click", start);

let player = { speed: 5, x: 100, y: 100, score: 0 };

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

for (let i = 0; i < btn.length; i++) {
  btn[i].addEventListener("pointerdown", () => {
    console.log(btn[i].innerText);
    let curr = btn[i].innerHTML;
    keys[curr] = true;
  });
  btn[i].addEventListener("pointerup", () => {
    let curr = btn[i].innerHTML;
    keys[curr] = false;
  });
}

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  //   console.log(e.key);
  keys[e.key] = true;
  //   console.log(keys);
});

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  //   console.log(e.key);
  keys[e.key] = false;
  //   console.log(keys);
});

function endGame() {
  player.start = false;
  startscreen.classList.remove("hide");
  bgAudio.pause();
  crashAudio.play();
}

function isCollide(a, b) {
  aRect = a.getBoundingClientRect();
  bRect = b.getBoundingClientRect();

  return !(
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right ||
    aRect.bottom < bRect.top
  );
}

function moveLines() {
  let lines = document.querySelectorAll(".lines");
  lines.forEach(function (item) {
    if (item.y >= 750) {
      item.y -= 750;
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function moveEnemy(car) {
  let enemyCar = document.querySelectorAll(".enemy");
  enemyCar.forEach(function (item) {
    if (isCollide(car, item)) {
      endGame();
    }
    if (item.y >= 750) {
      item.y = -300;
      item.style.left = Math.floor(Math.random() * 350) + "px";
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function gamePlay() {
  //   console.log("clicked");
  const car = document.querySelector(".car");
  let road = gameArea.getBoundingClientRect();
  // console.log(road);
  if (player.start) {
    moveLines();
    moveEnemy(car);

    if (keys.ArrowUp && player.y > road.top) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < road.bottom - 70) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < road.width - 45) {
      player.x += player.speed;
    }

    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    window.requestAnimationFrame(gamePlay);
    score.innerHTML = "Score : " + player.score++;
    if (player.score % 200 == 0) {
      player.speed += 1;
    }
  }
}

function start() {
  // gameArea.classList.remove("hide");
  startscreen.classList.add("hide");
  gameArea.innerHTML = "";
  score.classList.remove("hide");

  player.start = true;
  player.score = 0;
  window.requestAnimationFrame(gamePlay);
  bgAudio.play();

  for (let i = 0; i < 5; i++) {
    let roadline = document.createElement("div");
    roadline.setAttribute("class", "lines");
    roadline.y = i * 150;
    roadline.style.top = i * 150 + "px";
    gameArea.appendChild(roadline);
  }

  let car = document.createElement("div");
  car.classList.add("car");
  gameArea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  for (let i = 0; i < 3; i++) {
    let enemyCar = document.createElement("div");
    enemyCar.setAttribute("class", "enemy");
    enemyCar.y = (i + 1) * 350 * -1;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
    gameArea.appendChild(enemyCar);
  }
}
