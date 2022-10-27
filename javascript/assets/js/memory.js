//01 HTML/CSS 디자인구성
//02 클릭한 카드 뒤집기
//03 두개의 카드 뒤집기 확인하기(첫번째, 두번째)

const memoryWrap = document.querySelector(".memory__wrap");
const memoryCards = memoryWrap.querySelectorAll(".cards li");

//카드 뒤집기

let cardOne, cardTwo; //선택한 카드
let disableDeck = false;
let matchedCard = 0; //맞춘 카드
let sound = [
  "../../assets/audio/correct.mp3",
  "../../assets/audio/error.mp3",
  "../../assets/audio/Success.mp3",
];
let soundMatch = new Audio(sound[0]);
let soundUnMatch = new Audio(sound[1]);
let soundSuccess = new Audio(sound[2]);

function flipCard(e) {
  let clickedCard = e.target;

  if (clickedCard !== cardOne && !disableDeck) {
    console.log(clickedCard);
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
      alert("게임오버");
      shuffleCard();
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
  matchedCard = 0;

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  let result = arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
  console.log(result);

  memoryCards.forEach((card, index) => {
    card.classList.remove("flip");

    setTimeout(() => {
      card.classList.add("flip");
    }, 200 * index);

    setTimeout(() => {
      card.classList.remove("flip");
    }, 4000);

    let imgTag = card.querySelector(".back img");
    imgTag.src = `../../assets/img/memory_card${arr[index]}.jpg`;
  });
}
shuffleCard();

//카드 클릭
memoryCards.forEach((card) => {
  card.addEventListener("click", flipCard);
});
