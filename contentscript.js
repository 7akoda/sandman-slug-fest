// Create the game board element
const board = document.createElement("div");
board.id = "game-board";
const gridSize = 33;
const minInterval = 0.04 * 60 * 1000;
const maxInterval = 0.3 * 60 * 1000;
let activeTarget = null;

board.style.display = "grid";
board.style.gridTemplateColumns = "repeat(33, 3vw)";
board.style.gridTemplateRows = "repeat(33, 3vh)";
// z index 9999 forces it to be at the forefront of the webpage
board.style.zIndex = "9999";
//centered blah blah
board.style.position = "absolute";

function updatePosition() {
  const scrollY = window.scrollY || window.pageYOffset;
  const newTop = 50 + scrollY;
  board.style.top = newTop + "px";
}

document.body.appendChild(board);

// Load audio files
const notiSound = new Audio(
  chrome.runtime.getURL("audio/tf2-notification-sound.mp3")
);
const critSound = new Audio(
  chrome.runtime.getURL("audio/critical-hit-sounds-effect.mp3")
);

// Flag to track user interaction
let userInteracted = false;

// Add click event listener to start the game on user interaction
document.addEventListener("click", () => {
  if (!userInteracted) {
    userInteracted = true;
    extensionApp();
    updatePosition();
  }
});

// Main game logic
function extensionApp() {
  const interval = getRandomInt(minInterval, maxInterval);
  setInterval(drawTarget, interval);
}

//random position for target
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

//random number for interval timing of targets appearance
function getRandomInt(minInterval, maxInterval) {
  return (
    Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
  );
}

//create element for game, in this case target
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

//if target already exists, remove it, otherwise display target and notify user
function drawTarget() {
  const startTime = Date.now();
  localStorage.setItem("startTime", startTime);
  if (activeTarget) {
    activeTarget.remove();
  }

  const target = generateTarget();
  const targetElement = createGameElement("div", "target");

  targetElement.style.width = "35px";
  targetElement.style.height = "35px";
  targetElement.style.borderRadius = "50%";
  targetElement.style.background =
    "url(" + chrome.runtime.getURL("images/tf2baseball.png") + ") no-repeat";
  targetElement.style.backgroundSize = "100%";
  setPosition(targetElement, target);
  targetElement.addEventListener("click", handleTargetClick);
  board.appendChild(targetElement);
  activeTarget = targetElement;
  notiSound.play();
  console.log(targetElement);
}

//if targets clicked play sound and remove target
function handleTargetClick(event) {
  const targetElement = event.target;
  critSound.play();
  targetElement.remove();
  const endTime = Date.now();
  const startTime = localStorage.getItem("startTime");
  const elapsedTime = endTime - startTime;
  chrome.runtime.sendMessage(chrome.runtime.id, {
    action: "target_clicked",
    elapsedTime: elapsedTime,
  });
}

function generateTarget() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}
