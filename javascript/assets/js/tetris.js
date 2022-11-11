const tetrisWrap = document.querySelector(".tetris__wrap");
const playground = tetrisWrap.querySelector(".playground > ul");
const tetrisStartBtn = tetrisWrap.querySelector(".start__inner .tetris__start");
const tetrisRule = tetrisWrap.querySelector(".tetreis__rule");
const tetrisRestart = tetrisWrap.querySelector(".tetris__restart");
const closeTetris = tetrisWrap.querySelector(".tetris__close");
const tetrisMusic = tetrisWrap.querySelector("#audio__tetris");
let tetrisScore = tetrisWrap.querySelector(".tetris__score");

// variables
let rows = 20;
let cols = 10;
let scores = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

// 블록 정보
const movingItem = {
  type: "Tmino",
  direction: 0, //블록 모양
  top: 3,
  left: 0,
};

// 블록 좌표값
const blocks = {
  Tmino: [
    [
      [2, 1],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [1, 2],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [1, 2],
      [0, 1],
      [2, 1],
      [1, 1],
    ],
    [
      [2, 1],
      [1, 2],
      [1, 0],
      [1, 1],
    ],
  ],
  Imino: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  ],
  Omino: [
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  ],
  Zmino: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
  ],
  Smino: [
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  ],
  Jmino: [
    [
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
  ],
  Lmino: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 0],
      [2, 1],
    ],
  ],
};
// 시작하기
function init() {
  tempMovingItem = { ...movingItem };
  for (let i = 0; i < rows; i++) {
    prependNewLine(); //블록 라인 만들기
    //   renderBlocks(); //블록 출력하기
  }
  generateNewBlock(); //블록 만들기
}

// 블록 만들기
function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < cols; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playground.prepend(li);
}

// 블록 출력하기
function renderBlocks(moveType = "") {
  //   const ty = tempMovingItem.type;
  //   const di = tempMovingItem.directioin;
  //   const to = tempMovingItem.top;
  //   const le = tempMovingItem.left;

  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving");
  });
  blocks[type][direction].some((block) => {
    const x = block[0] + left; //2 0 1 1
    const y = block[1] + top; //1 1 0 1

    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const isAvailable = checkEmpty(target);
    if (isAvailable) {
      target.classList.add(type, "moving");
    } else {
      tempMovingItem = { ...movingItem };

      if (moveType === "retry") {
        clearInterval(downInterval);
        tetrisOver();
      }

      setTimeout(() => {
        renderBlocks("retry");
        if (moveType === "top") {
          seizeBlock();
        }
      }, 0);
      return true;
    }
    // console.log({ playground })
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

//블록 맨밑 감지
function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkMatch();
}

//한줄 제거하기
function checkMatch() {
  const childNodes = playground.childNodes;
  childNodes.forEach((child) => {
    let matched = true;
    child.children[0].childNodes.forEach((li) => {
      if (!li.classList.contains("seized")) {
        matched = false;
      }
    });
    if (matched) {
      child.remove();
      prependNewLine();
      scores++;
      let tetris = scores * 100;
      tetrisScore.innerHTML = `당신의 점수는${tetris}점`;
    }
  });
  generateNewBlock();
}

//새로운 블록 만들기
function generateNewBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, duration);
  const blockArray = Object.entries(blocks);
  const randomIndex = Math.floor(Math.random() * blockArray.length);
  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 0;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}

//빈칸 확인하기
function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) {
    return false;
  }
  return true;
}

//블록 움직이기
function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}

//모양 바꾸기
function changeDirection() {
  const direction = tempMovingItem.direction;
  direction === 3
    ? (tempMovingItem.direction = 0)
    : (tempMovingItem.direction += 1);
  renderBlocks();
}

//빨리 내리기
function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 10);
}

//이벤트
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1);
      break;
    case 38:
      changeDirection();
      break;
    case 32:
      dropBlock();
      break;
    default:
      break;
  }
});

//시작버튼 클릭시 게임 시작
function startTetris() {
  tetrisStartBtn.addEventListener("click", (e) => {
    tetrisStartBtn.classList.remove("show");
    tetrisScore.classList.add("show");
    tetrisRule.classList.remove("show");
    tetrisMusic.play();
    init();
  });
}
startTetris();

//game over
function tetrisOver() {
  tetrisRestart.classList.add("show");
  tetrisMusic.pause();
}

//restart btn
tetrisRestart.addEventListener("click", () => {
  restart();
  tetrisMusic.play();
});

//restart game
function restart() {
  playground.innerHTML = "";
  tetrisRestart.classList.remove("show");
  scores = 0;
  init();
}

//game close
closeTetris.addEventListener("click", () => {
  tetrisWrap.classList.remove("show");
  tetrisMusic.pause();
});

//아이콘 클릭시 등장
const icon4 = document.querySelector(".icon4");
icon4.addEventListener("click", () => {
  tetrisWrap.classList.toggle("show");
  scores = 0;
  playground.innerHTML = "";
  tetrisMusic.play();
});
