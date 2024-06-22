let deck;
let playerPoints = 0;
let dealerPoints = 0;
let dealerHand = [];
let cribHand = [];
let playerHand = [];
let pickCrib = true;
let cardsPicked = 0;
let playCount = 0;
let playedCards = 0;
let isPlayerDealer;
let bobsHand = [];
let playHand = [];
let isPlayerLastPlay;


window.onload = function() {
    buildDeck();
    shuffleDeck();
    document.getElementById("deckImage").addEventListener('click', pickDealer);
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

function pickDealer(){
    document.getElementById("deckImage").removeEventListener('click', pickDealer);
    cardImg = document.createElement("img");
    card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    document.getElementById("your-cards").appendChild(cardImg);

    cardImg2 = document.createElement("img");
    card2 = deck.pop();
    cardImg2.src = "./cards/" + card2 + ".png";
    document.getElementById("dealer-cards").appendChild(cardImg2);

    isPlayerDealer = getValue(card) <= getValue(card2)
    setTimeout(() => {
        document.getElementById("your-cards").removeChild(cardImg);
        document.getElementById("dealer-cards").removeChild(cardImg2);
        startGame();
      }, 1000);
}

function startGame() {
    document.getElementById("button").removeEventListener("click", startGame);
    document.getElementById("button-text").innerText = "";
    removeAllImages(document.getElementById('the-play'));
    removeAllImages(document.getElementById('crib-cards'));
    let images = document.getElementById('deck').querySelectorAll('img');
    if (images.length >= 2) {
        document.getElementById('deck').removeChild(images[1]);
    }
    if(isPlayerDealer){
        document.getElementById("bob-dealer").innerText = "";
        document.getElementById("player-dealer").innerText = "Dealer";
    }
    else{
        document.getElementById("player-dealer").innerText = "";
        document.getElementById("bob-dealer").innerText = "Dealer";
    }
    buildDeck();
    shuffleDeck();
    pickCrib = true;
    playCount = 0;
    playedCards = 0;
    cardsPicked = 0;
    dealerHand = [];
    cribHand = [];
    playerHand = [];
    for (let i = 0; i < 6; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        dealerHand.push(card);
        bobsHand.push(card);
        cardImg.src = "./cards/BACK.png";
        cardImg.className = "dealer-card";
        document.getElementById("dealer-cards").appendChild(cardImg);

        cardImg = document.createElement("img");
        card = deck.pop();
        playerHand.push(card);
        playHand.push(card);
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
    if(pickCrib && cardsPicked < 2){
        this.classList.add('card-move');
        moveCardToCrib(this);
        if(cardsPicked == 2){
            disableClicks();
            cardsPicked = 0;
            setTimeout(function() {
                dealerPlay();
                dealerPlay();
                pickCrib = false;
                // enableClicks();
                playedCards = 0;
                if(isPlayerDealer){
                    cutDeck();
                }
                else{
                    document.getElementById("deckImage").addEventListener('click', cutDeck);
                }
            }, 1000);
        }
        console.log(cribHand);
        this.removeEventListener('click', clickCard);
    }
    else if(!pickCrib){
        if(playCount + getValue(this) <= 31){
            isPlayerLastPlay = true;
            this.classList.add('card-move');
            moveCardToPlay(this);
            disableClicks();
            setTimeout(function() {
                if(bobsHand.length != 0 && playHand.length != 0){
                    console.log("bobsHand.length != 0 && playHand.length != 0");
                    callDealerPlay();
                }
                else if(bobsHand.length != 0 && playHand.length == 0){
                    console.log("bobsHand.length != 0 && playHand.length == 0");
                    while(bobsHand.length != 0){
                        callDealerPlay();
                    }
                }
                else if(checkPlayableCards(playHand) < 0 && checkPlayableCards(bobsHand) < 0){
                    console.log("checkPlayableCards(playerHand) < 0 && checkPlayableCards(bobsHand) < 0");
                    playCount = 0;
                    if(isPlayerLastPlay){
                        callDealerPlay();
                    }
                    else{
                        enableClicks();
                    }
                }
                if(bobsHand.length + playHand.length == 0){
                    finishRound();
                }
            }, 1000);
            this.removeEventListener('click', clickCard);
        }
    }
    console.log(playHand);
    console.log(bobsHand);
}

function callDealerPlay(){
    if(checkPlayableCards(playHand) < 0 && checkPlayableCards(bobsHand) < 0){
        console.log("checkPlayableCards(playerHand) < 0 && checkPlayableCards(bobsHand) < 0");
        playCount = 0;
    }
    playCount += dealerPlay();
    document.getElementById("play-sum").innerText = playCount;
    if(checkPlayableCards(playHand) < 0 && checkPlayableCards(bobsHand) < 0){
        console.log("checkPlayableCards(playerHand) < 0 && checkPlayableCards(bobsHand) < 0");
        playCount = 0;
    }
    enableClicks();
}

function moveCardToCrib(card){
    cardsPicked += 1;
    animateCardMovement(card, "crib-cards");
    playerHand = playerHand.filter(function (temp) {
        return temp !== cardName(card);
    });
    playHand = playHand.filter(function (temp) {
        return temp !== cardName(card);
    });
    cribHand.push(cardName(card));
    playedCards += 1;
}

function moveCardToPlay(card){
    animateCardMovement(card, "the-play");
    setTimeout(() => {
    playHand = playHand.filter(function (temp) {
        return temp !== cardName(card);
    });
    playCount += getValue(card);
    document.getElementById("play-sum").innerText = playCount;
    playedCards += 1;
    playerPoints += checkPlayPoints();
    document.getElementById("player-points").innerText = playerPoints;
    }, 100);
}

function checkPlayPoints(){
    let points = 0;
    if(playCount == 15 || playCount == 31){
        points += 2
    }
        let playCards = document.getElementById("the-play")
        let cards = Array.from(playCards.querySelectorAll('img'));
        cards = cards.map(element => getRank(element.src.substring(element.src.lastIndexOf("/") + 1, element.src.lastIndexOf(".png"))));
        cardRank = cards[cards.length - 1];
        let i = cards.length - 2
        let matches = 0;
        while(i >= 0 && cardRank == cards[i]){
            matches += 1;
            if(matches == 1){
                points += 2;
            }
            else if(matches == 2){
                points += 6;
            }
            else{
                points += 12;
            }
            i -= 1
        }
        if(cards.length >= 3){
            points += countPlayRun(cards);
        }
        return points;
}

function countPlayRun(cards){
    let distance = cards[cards.length - 1] - cards[cards.length - 2];
    let distance2 = cards[cards.length - 1] - cards[cards.length - 3];
    let distance3 = 0;
    if(cards.length >= 4){
        distance3 = cards[cards.length - 1] - cards[cards.length - 4];
    }
    if(distance == 1){
        if(distance2 == -1){
            if(distance3 == 2 || distance3 == -2){
                return 4;
            }
            else{
                return 3;
            }
        }
        else if(distance2 == -2 && distance3 == -1){
            return 4;
        }
        else if(distance2 == 2){
            if(distance3 == 3 || distance3 == -1){
                return 4;
            }
            else{
                return 3;
            }
        }
        else if(distance2 == 3 && distance3 == 2){
            return 4;
        }
    }
    else if(distance == 2){
        if(distance2 == 1){
            if(distance3 == -1 || distance3 == 3){
                return 4;
            }
            else{
                return 3;
            }
        }
        else if((distance2 == 3 || distance2 == -1) && distance3 == 1){
            return 4;
        }
    }
    else if(distance == 3){
        if(distance2 == 2 && distance3 == 1){
            return 4;
        }
        else if(distance2 == 1 && distance3 == 2){
            return 4;
        }
    }
    else if(distance == -1){
        if(distance2 == 1){
            if(distance3 == 2 || distance3 == -2){
                return 4;
            }
            else{
                return 3;
            }
        }
        else if(distance2 == 2 && distance3 == 1){
            return 4;
        }
        else if(distance2 == -2){
            if(distance3 == -3 || distance3 == 1){
                return 4;
            }
            else{
                return 3;
            }
        }
        else if(distance2 == -3 && distance3 == -2){
            return 4;
        }
    }
    else if(distance == -2){
        if(distance2 == -1){
            if(distance3 == 1 || distance3 == -3){
                return 4;
            }
            else{
                return 3;
            }
        }
        else if((distance2 == -3 || distance2 == 1) && distance3 == -1){
            return 4;
        }
    }
    else if(distance == -3){
        if(distance2 == -2 && distance3 == -1){
            return 4;
        }
        else if(distance2 == -1 && distance3 == -2){
            return 4;
        }
    }
    return 0;
}

function cutDeck(){
    cardImg = document.createElement("img");
    card = deck.pop();
    dealerHand.push(card);
    playerHand.push(card);
    cribHand.push(card);
    cardImg.src = "./cards/" + card + ".png";
    cardImg.id = "cut-card";
    document.getElementById("deck").appendChild(cardImg);
    if(isPlayerDealer){
        playCount += dealerPlay();
        playedCards += 1;
        document.getElementById("play-sum").innerText = playCount;
    }
    enableClicks();
}

function animateCardMovement(card, location){
    const rect = card.getBoundingClientRect();
    const containerRect = document.getElementById(location).getBoundingClientRect();
    const containerCenterX = containerRect.width / 2; 
    const offsetX = containerCenterX - rect.width / 2 - rect.left + (100 * playedCards/2);
    const offsetY = containerRect.top - rect.top;
    card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    setTimeout(() => {
        document.getElementById(location).appendChild(card);
        card.style.transform = 'none'; 
        card.classList.remove('card-move');
    }, 50);
}

function dealerPlay(){
    let cardImg = document.createElement("img");
    if(pickCrib){
        let dealerCards = document.getElementsByClassName("dealer-card");
        document.getElementById("dealer-cards").removeChild(dealerCards[0]);
        cardImg.src = "./cards/BACK.png";
        document.getElementById("crib-cards").appendChild(cardImg);
        removeCard = dealerHand[cardsPicked];
        dealerHand = dealerHand.filter(function (card) {
            return card !== removeCard;
        });
        bobsHand = bobsHand.filter(function (card) {
            return card !== removeCard;
        });
        cribHand.push(removeCard);
        return 0;
    }
    else if(checkPlayableCards(bobsHand) >= 0){
        isPlayerLastPlay = false;
        let index = checkPlayableCards(bobsHand);
        let dealerCards = document.getElementsByClassName("dealer-card");
        document.getElementById("dealer-cards").removeChild(dealerCards[0])
        card = bobsHand[index];
        bobsHand.splice(index, 1);
        cardImg.src = "./cards/" + card + ".png";
        document.getElementById("the-play").appendChild(cardImg);
        cardsPicked += 1;
        playedCards += 1;
        return getValue(card);
    }
    return 0;
}

function checkPlayableCards(hand){ 
    for(let i = 0; i < hand.length; i++){
        if(playCount + getValue(hand[i]) <= 31){
            return i;
        }
    }
    return -1;
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

function removeAllImages(div) {
    const images = div.querySelectorAll('img');
    images.forEach(img => div.removeChild(img));
}

function finishRound(){
    playerPoints += countpoints(playerHand);
    dealerPoints += countpoints(dealerHand);
    if(isPlayerDealer){
        playerPoints += countpoints(cribHand);
    }
    else{
        dealerPoints += countpoints(cribHand);
    }
    document.getElementById("player-points").innerText = playerPoints;
    document.getElementById("dealer-points").innerText = dealerPoints;
    enableClicks();
    document.getElementById("button-text").innerText = "start next round";
    isPlayerDealer = !isPlayerDealer;
    document.getElementById("button").addEventListener("click", startGame);
}

function countpoints(hand){
    let points = 0;
    points += samesuit(hand);
    points += countpairs(hand);
    points += count15s(hand) * 2;
    points += nobs(hand);
    hand = bubbleSort(hand);
    points += calculateConsecutiveScore(hand);
    return points
}

function count15s(list) {
    let count = 0;
    function findCombinations(start, sum) {
        if (sum === 15) {
            count++;
            return;
        }
        if (sum > 15) {
            return;
        }
        for (let i = start; i < list.length; i++) {
            findCombinations(i + 1, sum + getValue(list[i]));
        }
    }
    findCombinations(0, 0);
    return count;
}

function countpairs(hand){
    let count = 0;
    let i = 0;
    while(i < 4){
        let j = i + 1;
        while(j < 5){
            if(hand[i].substring(0, 2) == hand[j].substring(0, 2)){
                count += 2;
            }
            j += 1;
        }
        i += 1;
    }
    return count
}

function samesuit(hand){
    let i = 1;
    let suit = hand[0].substring(hand[i].length - 1, hand[0].length);
    while(i < 4){
        if(hand[i].substring(hand[i].length - 1, hand[i].length) != suit){
            return 0;
        }
        i += 1;
    }
    if(hand[i].substring(hand[i].length - 1, hand[i].length) == suit){
        return 5;
    }
    return 4;
}

function getRank(card) {
    const rank = card.split('-')[0];
    switch (rank) {
        case 'J':
            return 11;
        case 'Q':
            return 12;
        case 'K':
            return 13;
        case 'A':
            return 1; 
        default:
            return parseInt(rank);
    }
}

function bubbleSort(hand) {
    let n = 5;
    let swapped;
    do {
        swapped = false;
        for (let i = 1; i < n; i++) {
            if (getRank(hand[i - 1]) > getRank(hand[i])) {
                let temp = hand[i - 1];
                hand[i - 1] = hand[i];
                hand[i] = temp;
                swapped = true;
            }
        }
        n--;
    } while (swapped);
    return hand;
}

function calculateConsecutiveScore(hand) {
    let score = 0;
    let currentStreak = 1;
    let duplicate = 0;
    for (let i = 1; i < hand.length; i++) {
        if (getRank(hand[i]) == getRank(hand[i - 1]) + 1) {
            currentStreak++;
        } else if (getRank(hand[i]) == getRank(hand[i - 1])) {
            duplicate += 1;
        } else {
            if (currentStreak >= 3) {
                if(duplicate == 2){
                    score += 12;
                }
                else if(duplicate == 3){
                    score += 9;
                }
                else if(duplicate == 1){
                    score += currentStreak * 2;
                }
                else{
                    score += currentStreak;
                }
            }
            currentStreak = 1;
        }
    }
    if (currentStreak >= 3) {
        score += currentStreak;
    }
    return score;
}

function nobs(hand){
    let suit = hand[4].split('-')[1]
    for(let i = 0; i < 4; i++){
        let split = hand[i].split('-');
        if(split[0] == 'J' && split[1] == suit){
            return 1;
        }
    }
    return 0;
}