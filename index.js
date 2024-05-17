let deck;
let playerPoints;
let dealerPoints;
let dealerHand = [];
let cribHand = [];
let playerHand = [];
let pickCrib = true;
let cardsPicked = 0;
let playCount = 0;
let playedCards = 0;


window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    for (let i = 0; i < 6; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        dealerHand.push(card);
        cardImg.src = "./cards/BACK.png";
        cardImg.className = "dealer-card";
        document.getElementById("dealer-cards").appendChild(cardImg);

        cardImg = document.createElement("img");
        card = deck.pop();
        playerHand.push(card);
        cardImg.src = "./cards/" + card + ".png";
        document.getElementById("your-cards").appendChild(cardImg);
        cardImg.addEventListener('click', clickCard);
    }
}

function getValue(card) {
    if(typeof card == 'string'){
        var cardName = card;
    }
    else{
        var cardName = card.src.substring(card.src.lastIndexOf("/") + 1, card.src.lastIndexOf(".png"));
    }

    let data = cardName.split("-"); 
    let value = data[0];

    if (isNaN(value)) { 
        if (value == "A") {
            return 1;
        }
        return 10;
    }
    return parseInt(value);
}

function cardName(card){
    return card.src.substring(card.src.lastIndexOf("/") + 1, card.src.lastIndexOf(".png"));
}

function clickCard() {
    this.classList.add('card-move');
    if(pickCrib && cardsPicked < 2){
        moveCardToCrib(this);
        if(cardsPicked == 2){
            disableClicks();
            cardsPicked = 0;
            setTimeout(function() {
                dealerPlay();
                dealerPlay();
                pickCrib = false;
                enableClicks();
                playedCards = 0;
            }, 1000);
        }
    }
    else if(!pickCrib){
        moveCardToHand(this);
        disableClicks();
        setTimeout(function() {
            playCount += dealerPlay();
            document.getElementById("play-sum").innerText = playCount;
            if(playedCards < 4){
                enableClicks();
            }
            else{
                finishRound();
            }
        }, 1000);
    }
    this.removeEventListener('click', clickCard);
    console.log(playerHand);
    console.log(dealerHand);
    console.log(cribHand);
}

function moveCardToCrib(card){
    cardsPicked += 1;
    animateCardMovement(card, "crib-cards");
    playerHand = playerHand.filter(function (temp) {
        return temp !== cardName(card);
    });
    cribHand.push(cardName(card));
    playedCards += 1;
}

function moveCardToHand(card){
    animateCardMovement(card, "the-play");
    playCount += getValue(card);
    document.getElementById("play-sum").innerText = playCount;
    playedCards += 1;
}

function animateCardMovement(card, location){
    const rect = card.getBoundingClientRect();
    const containerRect = document.getElementById(location).getBoundingClientRect();
    const containerCenterX = containerRect.width / 2; 
    const offsetX = containerCenterX - rect.width / 2 - rect.left + (125 * playedCards);
    const offsetY = containerRect.top - rect.top;
    card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    setTimeout(() => {
        document.getElementById(location).appendChild(card);
        card.style.transform = 'none'; 
        card.classList.remove('card-move');
    }, 500);
}

function dealerPlay(){
    let cardImg = document.createElement("img");
    let dealerCards = document.getElementsByClassName("dealer-card");
    document.getElementById("dealer-cards").removeChild(dealerCards[0]);
    if(pickCrib){
        cardImg.src = "./cards/BACK.png";
        document.getElementById("crib-cards").appendChild(cardImg);
        removeCard = dealerHand[cardsPicked];
        dealerHand = dealerHand.filter(function (card) {
            return card !== removeCard;
        });
        cribHand.push(removeCard);
        return 0;
    }
    else{
        card = dealerHand[cardsPicked];
        cardImg.src = "./cards/" + card + ".png";
        document.getElementById("the-play").appendChild(cardImg);
        cardsPicked += 1;
        return getValue(dealerHand[cardsPicked - 1]);
    }
}

function animateCardFlip(card, location){
    
}

function playPoints(){

}

function disableClicks() {
    var overlay = document.getElementById("overlay");
    overlay.style.display = "block";
}

function enableClicks() {
    var overlay = document.getElementById("overlay");
    overlay.style.display = "none";
}

function finishRound(){

}