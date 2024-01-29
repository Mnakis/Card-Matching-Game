"use strict";

const cards = document.querySelectorAll(".card");
const timeTag = document.querySelector(".time b");
const flipsTag = document.querySelector(".flips b");
const restartBtn = document.querySelector(".details button");
const startContainer = document.getElementById("startContainer");
const gameContainer = document.getElementById("gameContainer");
const playButton = document.getElementById("playButton");
const infoIcon = document.getElementById("infoIcon");
const infoPopup = document.getElementById("infoPopup");


let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let card1, card2, timer;


infoIcon.addEventListener("mouseover", () => {
  infoPopup.style.display = "block";
});

infoPopup.addEventListener("mouseout", () => {
  infoPopup.style.display = "none";
});

playButton.addEventListener("click", () => {
  startContainer.style.display = "none";
  gameContainer.style.display = "block";
  playButton.style.transform = "scale(0.9)";
  setTimeout(() => {
    playButton.style.transform = "scale(1)";
  }, 300);
  shuffleCard();
});

function initialTimer() {
  if (timeLeft <= 0) {
    return clearInterval(timer);
  }
  timeLeft--;
  timeTag.innerText = timeLeft;
}

function flipCard({ target: clickedCard }) {
  if (!isPlaying) {
    isPlaying = true;
    timer = setInterval(() => {
      timeTag.innerText++;
    }, 1000);
  }
  if (clickedCard !== card1 && !disableDeck) {
    flips++;
    flipsTag.innerText = flips;
    clickedCard.classList.add("flip");
    if (!card1) {
      return (card1 = clickedCard);
    }
    card2 = clickedCard;
    disableDeck = true;
    let card1Img = card1.querySelector(".back-view img").src,
      card2Img = card2.querySelector(".back-view img").src;
    matchCard(card1Img, card2Img);
  }
}

function matchCard(img1, img2) {
  if (img1 === img2) {
    matchedCard++;
    if (matchedCard == 6) {
      clearInterval(timer);
      showStatistics();
      return;
    }
    card1.removeEventListener("click", flipCard);
    card2.removeEventListener("click", flipCard);
    card1 = card2 = "";
    disableDeck = false;
  } else {
    setTimeout(() => {
      card1.classList.add("shake");
      card2.classList.add("shake");
    }, 400);

    setTimeout(() => {
      card1.classList.remove("shake", "flip");
      card2.classList.remove("shake", "flip");
      card1 = card2 = "";
      disableDeck = false;
    }, 1200);
  }
}

function showStatistics() {
  const starRating = calculateStarRating();

  const overlayContainer = document.createElement("div");
  overlayContainer.classList.add("statistics-overlay");

  const statisticsBox = document.createElement("div");
  statisticsBox.classList.add("statistics-box");

  const timeTaken = document.createElement("p");
  timeTaken.innerText = `Geçen süre: ${timeTag.innerText} saniye`;

  const flipsMade = document.createElement("p");
  flipsMade.innerText = `Yapılan çevirmeler: ${flipsTag.innerText}`;

  const starRatingElement = document.createElement("p");
  starRatingElement.innerText = `Yıldız: ${starRating}`;


  const restartButton = document.createElement("button");
  restartButton.innerText = "Yeniden Başlat";
  
  restartButton.addEventListener("click", () => {
    restartButton.classList.add("restart-button-animated");
    restartGame();
    document.body.removeChild(overlayContainer);
  });

  statisticsBox.appendChild(timeTaken);
  statisticsBox.appendChild(flipsMade);
  statisticsBox.appendChild(starRatingElement);
  statisticsBox.appendChild(restartButton);

  overlayContainer.appendChild(statisticsBox);

  document.body.appendChild(overlayContainer);
}

function restartGame() {
  shuffleCard();
}

function calculateStarRating() {
  const flipsMade = parseInt(flipsTag.innerText);
  if (flipsMade <= 10) {
    return '★★★★★'; 
  } else if (flipsMade <= 15) {
    return '★★★★☆'; 
  } else if (flipsMade <= 20) {
    return '★★★☆☆'; 
  } else if (flipsMade <= 25) {
    return '★★☆☆☆';
  } else {
    return '★☆☆☆☆';
  }
}

function shuffleCard() {
  flips = matchedCard = 0;
  card1 = card1 = "";
  clearInterval(timer);
  timeTag.innerText = 0;
  flipsTag.innerText = flips;
  disableDeck = isPlaying = false;

  let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  cards.forEach((card, i) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");

    setTimeout(() => {
      imgTag.src = `./assets/images/img-${arr[i]}.png`;
    }, 500);
    card.addEventListener("click", flipCard);
  });
}
shuffleCard();


restartBtn.addEventListener("click", shuffleCard);

cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});