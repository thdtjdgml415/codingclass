//01 HTML/CSS 디자인구성
//02 클릭한 카드 뒤집기
//03 두개의 카드 뒤집기 확인하기(첫번째, 두번째)

const memoryWrap = document.querySelector(".memory__wrap");
const memoryCards = memoryWrap.querySelectorAll(".cards li");
const memoryTime = document.querySelector(".memory_timer .timer"); //타이머
const memoryStart = document.querySelector(".memory__startbtn .memorystart"); //게임 시작버튼
const memoryCover = document.querySelector(".memory__cover"); //게임 커버

//카드 뒤집기
let cardOne, cardTwo; //선택한 카드
let disableDeck = false;
let matchedCard = 0; //맞춘 카드
let timeUp = 0; //시간
let timeInterval = "";
let memoryInterval = 0;

let sound = [
  "https://thdtjdgml415.github.io/codingclass/javascript/assets/audio/correct.mp3",
  "https://thdtjdgml415.github.io/codingclass/javascript/assets/audio/error.mp3",
  "https://github.com/thdtjdgml415/codingclass/blob/main/javascript/assets/audio/Success%201.m4a",
];
let soundMatch = new Audio(sound[0]);
let soundUnMatch = new Audio(sound[1]);
let soundSuccess = new Audio(sound[2]);

memoryStart.addEventListener("click", () => {
  startMemory();
});

// 게임 시작하기
function startMemory() {
  memoryCover.classList.remove("show");
  memoryInterval = setInterval(countMemoryTime, 1000);
  shuffleCard();
}

//시간 출력하기
function countMemoryTime() {
  timeUp++;
  if (matchedCard === 8) EndGame();
  memoryTime.innerHTML = displaymMmoryTime();
}

//시간 체크하기
function displaymMmoryTime() {
  let minutes = Math.floor(timeUp / 60);
  let seconds = timeUp % 60;

  //초가 한자리 수 일때 0을 추가
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function flipCard(e) {
  let clickedCard = e.target;

  if (clickedCard !== cardOne && !disableDeck) {
    clickedCard.classList.add("flip");
    //두개의 이미지 주소값 가져오기
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;

    let cardOneImg = cardOne.querySelector(".back img").src;
    let cardTwoImg = cardTwo.querySelector(".back img").src;

    matchCards(cardOneImg, cardTwoImg);
  }
}

//카드 확인 (두개의 이미지 비교)
function matchCards(img1, img2) {
  if (img1 == img2) {
    //같을 경우
    matchedCard++;
    soundMatch.play();
    if (matchedCard == 8) {
      EndGame();
    }

    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    disableDeck = false;
    soundSuccess.play();
  } else {
    //일치하지 않는 경우(틀린음악, 이미지가 좌우로 흔들림)
    setTimeout(() => {
      cardOne.classList.add("shakeX");
      cardTwo.classList.add("shakeX");
    }, 500);

    setTimeout(() => {
      cardOne.classList.remove("shakeX", "flip");
      cardTwo.classList.remove("shakeX", "flip");
      cardOne = cardTwo = "";
      disableDeck = false;
    }, 1600);

    soundUnMatch.play();
  }
}

//카드 섞기
function shuffleCard() {
  cardOne = cardTwo = "";
  disableDeck = false;

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  let result = arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  memoryCards.forEach((card, index) => {
    card.classList.remove("flip");

    setTimeout(() => {
      card.classList.add("flip");
    }, 200 * index);

    setTimeout(() => {
      card.classList.remove("flip");
    }, 4000);

    card.addEventListener("click", flipCard);
    matchedCard = 0;

    let imgTag = card.querySelector(".back img");
    imgTag.src = `../../assets/img/memory_card${arr[index]}.jpg`;
  });
}

//카드 클릭
// memoryCards.forEach((card) => {
//   card.addEventListener("click", flipCard);
// });

//아이콘 클릭시 게임 등장
document.querySelector(".icon3").addEventListener("click", () => {
  memoryWrap.classList.toggle("show");
  timeUp = 0;
  clearInterval(memoryInterval);
  memoryCover.classList.add("show");
});

//종료버튼 클릭시 꺼짐
document.querySelector(".memory__header img").addEventListener("click", () => {
  memoryWrap.classList.remove("show");
});

//게임 끝나면
function EndGame() {
  document.querySelector(".memory__wrap .frank__wrap").classList.add("show");
  const ResultGame = document.querySelector(".memory__wrap .result__memory");
  if (timeUp < 30) {
    clearInterval(memoryInterval);
    ResultGame.innerHTML = `당신의 시간은 ${timeUp}초 상위 20% 입니다.`;
  } else if (30 <= timeUp && 60 >= timeUp) {
    clearInterval(memoryInterval);
    ResultGame.innerHTML = `당신의 시간은 ${timeUp}초 그냥 사.람.정.도 입니다.`;
  } else {
    clearInterval(memoryInterval);
    ResultGame.innerHTML = `당신의 시간은 ${timeUp}초 그냥 하지마세요`;
  }
}

//재시작 버튼 클릭시
document
  .querySelector(".result__inner .restart")
  .addEventListener("click", () => {
    restart();
  });

function restart() {
  setTimeout(() => {
    document
      .querySelector(".memory__wrap .frank__wrap")
      .classList.remove("show");
    memoryCards.forEach((card) => {
      card.addEventListener("click", flipCard);
    });
  }, 1000);
  timeUp = 0;
  startMemory();
  shuffleCard();
}
