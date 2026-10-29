const gameArea = document.querySelector(".game-area");
const stageArt = document.querySelector(".stage-art");
const bottomDecoration = document.querySelector(".bottom-decoration");
const status = document.querySelector(".status");
const instructions = document.querySelector(".instructions");
const playfield = document.querySelector(".playfield");
const player = document.querySelector(".player");
const scoreDisplay = document.querySelector(".score span");
const timer = document.querySelector(".timer");
const timeDisplay = timer.querySelector("span");
const gameMessage = document.querySelector(".game-message");
const results = document.querySelector(".results");
const finalRankDisplay = document.querySelector(".final-rank");
const rankCommentDisplay = document.querySelector(".rank-comment");
const rankList = document.querySelector(".rank-list");
const reaction = document.querySelector(".reaction");
const pauseMessage = document.querySelector(".pause-message");
const startButton = document.querySelector(".start-button");
const pauseButton = document.querySelector(".pause-button");
const giveUpButton = document.querySelector(".give-up-button");
const returnStartButton = document.querySelector(".return-start-button");
const startButtonLabel = startButton.querySelector(".button-label");
const startButtonIcon = startButton.querySelector(".button-icon");
const pauseButtonIcon = pauseButton.querySelector(".button-icon");
const pauseButtonLabel = pauseButton.querySelector(".button-label");

const gameDuration = 45;
const ranks = [
  { minimum: 45, name: "はちみつマスター級", comment: "すごい！キャンディ名人だね！" },
  { minimum: 35, name: "はちみつ級", comment: "はちみつみたいにあま〜い大活躍！" },
  { minimum: 25, name: "おほしさま級", comment: "おほしさまみたいにキラキラ！" },
  { minimum: 15, name: "くまさん級", comment: "くまさんに負けずにがんばったね！" },
  { minimum: 5, name: "うさぎさん級", comment: "ぴょんぴょんナイスキャッチ！" },
  { minimum: 0, name: "ひよこさん級", comment: "さいごまで遊べてえらいね！" }
];

const fallingItems = [];
const itemTypes = [
  { emoji: "🍬", kind: "candy", points: 1, chance: 0.4 },
  { emoji: "🍪", kind: "cookie", points: 3, chance: 0.1 },
  { emoji: "🍰", kind: "cake", points: 5, chance: 0.05 },
  { emoji: "🐻", kind: "bear", points: 0, chance: 0.45 }
];

let score = 0;
let gameStarted = false;
let gamePaused = false;
let lastFrameTime = 0;
let spawnElapsed = 0;
let remainingTime = gameDuration;
let reactionTimer;

function setScreen(screen) {
  gameArea.dataset.screen = screen;
  bottomDecoration.src = screen === "play"
    ? "images/play_under.jpg"
    : `images/${screen}.jpg`;
}

function positionPlayfield() {
  const gameAreaTop = gameArea.getBoundingClientRect().top;
  const activeMessage = gameMessage.hidden ? instructions : gameMessage;
  const messageTop = activeMessage.getBoundingClientRect().top;

  gameArea.style.setProperty("--playfield-top", `${messageTop - gameAreaTop - 10}px`);
}

function movePlayer(clientX) {
  const fieldRect = playfield.getBoundingClientRect();
  const playerWidth = player.getBoundingClientRect().width;
  const pointerX = clientX - fieldRect.left;
  const playerX = Math.max(0, Math.min(pointerX - playerWidth / 2, playfield.clientWidth - playerWidth));

  player.style.left = `${playerX}px`;
  player.style.transform = "none";
}

positionPlayfield();
window.addEventListener("resize", positionPlayfield);
movePlayer(playfield.getBoundingClientRect().left + playfield.clientWidth / 2);

playfield.addEventListener("pointermove", (event) => {
  movePlayer(event.clientX);
});

playfield.addEventListener("pointerdown", (event) => {
  movePlayer(event.clientX);
});

function spawnItem() {
  let randomValue = Math.random();
  const type = itemTypes.find((itemType) => {
    randomValue -= itemType.chance;
    return randomValue < 0;
  }) || itemTypes[itemTypes.length - 1];
  const element = document.createElement("span");

  element.className = "falling-item";
  element.textContent = type.emoji;
  element.setAttribute("aria-hidden", "true");
  playfield.append(element);

  const maxX = Math.max(0, playfield.clientWidth - element.offsetWidth);
  const x = Math.random() * maxX;
  element.style.left = `${x}px`;

  fallingItems.push({
    element,
    kind: type.kind,
    points: type.points,
    y: 0
  });
}

function overlaps(first, second) {
  const firstRect = first.getBoundingClientRect();
  const secondRect = second.getBoundingClientRect();

  return firstRect.left < secondRect.right
    && firstRect.right > secondRect.left
    && firstRect.top < secondRect.bottom
    && firstRect.bottom > secondRect.top;
}

function showBearReaction() {
  clearTimeout(reactionTimer);
  player.classList.remove("is-eating");
  void player.offsetWidth;
  player.classList.add("is-eating");
  reaction.textContent = "いただきます！";
  gameMessage.textContent = "🐻にぶつかった！スコア0！";
  gameMessage.hidden = false;

  reactionTimer = setTimeout(() => {
    player.classList.remove("is-eating");
    reaction.textContent = "";
    gameMessage.textContent = "がんばってお菓子を集めよう！";
  }, 1500);
}

function getRank(currentScore) {
  return ranks.find((rank) => currentScore >= rank.minimum);
}

function showResults() {
  const currentRank = getRank(score);
  finalRankDisplay.textContent = `${currentRank.name}（${score}点）`;
  rankCommentDisplay.textContent = `🐹「${currentRank.comment}」`;
  rankList.replaceChildren();

  ranks.forEach((rank, index) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const range = document.createElement("span");
    const maxScore = index === 0 ? null : ranks[index - 1].minimum - 1;

    name.textContent = rank.name;
    range.textContent = maxScore === null
      ? `${rank.minimum}点以上`
      : `${rank.minimum}〜${maxScore}点`;

    if (rank === currentRank) {
      item.classList.add("is-current");
      item.setAttribute("aria-current", "true");
      name.textContent = `★ ${rank.name}（今回）`;
    } else {
      item.classList.add("is-other");
    }

    item.append(name, range);
    rankList.append(item);
  });
}

function finishGame(reason = "time") {
  gameStarted = false;
  gamePaused = false;
  setScreen("finish");
  if (reason === "time") {
    remainingTime = 0;
  }
  timeDisplay.textContent = String(Math.ceil(remainingTime));
  timer.classList.remove("is-urgent");
  gameArea.classList.add("is-finished");
  results.hidden = false;
  clearTimeout(reactionTimer);
  player.classList.remove("is-eating");
  reaction.textContent = "";
  pauseMessage.hidden = true;
  gameMessage.hidden = true;

  while (fallingItems.length > 0) {
    fallingItems.pop().element.remove();
  }

  gameMessage.textContent = reason === "time"
    ? "時間切れ！"
    : "ギブアップ！ここまでの結果だよ";
  document.querySelector("#results-heading").textContent = reason === "time"
    ? "今回のランク"
    : "ギブアップ！今回のランク";
  showResults();
  startButton.hidden = false;
  pauseButton.hidden = true;
  giveUpButton.hidden = true;
  returnStartButton.hidden = false;
  startButtonIcon.textContent = "🔄";
  startButtonLabel.textContent = "もう一度あそぶ";
}

function returnToStartScreen() {
  gameStarted = false;
  gamePaused = false;
  score = 0;
  remainingTime = gameDuration;
  clearTimeout(reactionTimer);
  setScreen("start");
  gameArea.classList.remove("is-finished");
  scoreDisplay.textContent = "0";
  timeDisplay.textContent = String(gameDuration);
  timer.classList.remove("is-urgent");
  results.hidden = true;
  instructions.hidden = false;
  gameMessage.hidden = true;
  pauseMessage.hidden = true;
  player.classList.remove("is-eating");
  reaction.textContent = "";
  startButton.hidden = false;
  startButtonIcon.textContent = "▶️";
  startButtonLabel.textContent = "スタート";
  pauseButton.hidden = true;
  giveUpButton.hidden = true;
  returnStartButton.hidden = true;
  positionPlayfield();
}

function updateGame(timestamp) {
  if (!gameStarted || gamePaused) {
    return;
  }

  const elapsed = lastFrameTime
    ? Math.min((timestamp - lastFrameTime) / 1000, 0.05)
    : 0;
  lastFrameTime = timestamp;
  remainingTime = Math.max(0, remainingTime - elapsed);
  timeDisplay.textContent = String(Math.ceil(remainingTime));
  timer.classList.toggle("is-urgent", remainingTime <= 10 && remainingTime > 0);

  if (remainingTime === 0) {
    finishGame();
    return;
  }

  spawnElapsed += elapsed;
  const spawnInterval = remainingTime <= 10 ? 0.5 : 1;

  if (spawnElapsed >= spawnInterval) {
    spawnElapsed -= spawnInterval;
    spawnItem();
  }

  let caughtPoints = 0;
  let caughtBear = false;

  for (let index = fallingItems.length - 1; index >= 0; index -= 1) {
    const item = fallingItems[index];
    item.y += 130 * elapsed;
    item.element.style.top = `${item.y}px`;

    if (overlaps(item.element, player)) {
      item.element.remove();
      fallingItems.splice(index, 1);

      if (item.kind === "candy") {
        caughtPoints += item.points;
      } else if (item.kind === "cookie" || item.kind === "cake") {
        caughtPoints += item.points;
      } else {
        caughtBear = true;
      }

      continue;
    }

    if (item.y > playfield.clientHeight) {
      item.element.remove();
      fallingItems.splice(index, 1);
    }
  }

  if (caughtBear) {
    score = 0;
    scoreDisplay.textContent = "0";
    showBearReaction();
  } else if (caughtPoints > 0) {
    score += caughtPoints;
    scoreDisplay.textContent = String(score);
  }

  requestAnimationFrame(updateGame);
}

startButton.addEventListener("click", () => {
  score = 0;
  remainingTime = gameDuration;
  lastFrameTime = 0;
  spawnElapsed = 0;
  gameStarted = true;
  gamePaused = false;
  setScreen("play");
  scoreDisplay.textContent = "0";
  timeDisplay.textContent = String(gameDuration);
  document.querySelector("#results-heading").textContent = "今回のランク";
  timer.classList.remove("is-urgent");
  gameArea.classList.remove("is-finished");
  results.hidden = true;
  pauseMessage.hidden = true;
  instructions.hidden = true;
  gameMessage.hidden = false;
  player.classList.remove("is-eating");
  reaction.textContent = "";
  startButton.hidden = true;
  returnStartButton.hidden = true;
  startButtonIcon.textContent = "▶️";
  pauseButton.hidden = false;
  giveUpButton.hidden = false;
  pauseButtonIcon.textContent = "⏸️";
  pauseButtonLabel.textContent = "一時停止";
  gameMessage.textContent = "がんばってお菓子を集めよう！";
  positionPlayfield();

  requestAnimationFrame(updateGame);
});

returnStartButton.addEventListener("click", returnToStartScreen);

giveUpButton.addEventListener("click", () => {
  if (gameStarted) {
    finishGame("give-up");
  }
});

pauseButton.addEventListener("click", () => {
  if (!gameStarted) {
    return;
  }

  gamePaused = !gamePaused;
  pauseMessage.hidden = !gamePaused;
  pauseButtonIcon.textContent = gamePaused ? "▶️" : "⏸️";
  pauseButtonLabel.textContent = gamePaused ? "つづける" : "一時停止";

  if (!gamePaused) {
    lastFrameTime = 0;
    requestAnimationFrame(updateGame);
  }
});
