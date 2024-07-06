let deck;
let playerPoints = new ObservableNumber(0, "player-points");
let dealerPoints = new ObservableNumber(0, "dealer-points");
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

function ObservableNumber(initialValue, player) {
    let value = initialValue;

    this.add = function(amount) {
        value += amount;
        document.getElementById(player).innerText = value;
        if (value >= 12) {
            finishGame();
        }
    }
}


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
    document.getElementById("deck").appendChild(cardImg);
    cardImg.classList.add('card-move');
    setTimeout(() => {
    animateCardMovement(cardImg, "your-cards");
    setTimeout(() => {
        cardImg2 = document.createElement("img");
        card2 = deck.pop();
        cardImg2.src = "./cards/" + card2 + ".png";
        document.getElementById("dealer-cards").appendChild(cardImg2);
        isPlayerDealer = getRank(card) < getRank(card2)
        if(getRank(card) == getRank(card2)){
            document.getElementById("header").innerText = "It's a tie redraw!";
            setTimeout(() => {
                document.getElementById("dealer-cards").innerText = "";
                document.getElementById("your-cards").innerText = "";
                document.getElementById("deckImage").addEventListener('click', pickDealer);
            }, 2000);
            return;
        }
        if(isPlayerDealer){
            document.getElementById("header").innerText = "You Won! You are the dealer this round";
        }
        else{
            document.getElementById("header").innerText = "Sorry you lost. Bob are the dealer this round";
        }
        setTimeout(() => {
            document.getElementById("your-cards").removeChild(cardImg);
            document.getElementById("dealer-cards").removeChild(cardImg2);
            startGame();
        }, 3000);
    }, 1000);
}, 1000);
}

function startGame() {
    console.log(isPlayerDealer)
    document.getElementById("button").removeEventListener("click", startGame);
    document.getElementById("button-text").innerText = "";
    document.getElementById("header").innerText = "Pick two cards to add to the Crib";
    removeAllImages(document.getElementById('the-play'));
    removeAllImages(document.getElementById('crib-cards'));
    let images = document.getElementById('deck').querySelectorAll('img');
    if (images.length >= 2) {
        document.getElementById('deck').removeChild(images[1]);
    }
    if(isPlayerDealer){
        var token = document.createElement("div");
        token.classList.add("circle");
        token.innerText = "D";
        if(document.getElementById("bob-dealer").firstChild != null){
            document.getElementById("bob-dealer").removeChild(document.getElementById("bob-dealer").firstChild);
        }
        document.getElementById("player-dealer").appendChild(token);
    }
    else{
        var token = document.createElement("div");
        token.classList.add("circle");
        token.innerText = "D";
        if(document.getElementById("player-dealer").firstChild != null){
            document.getElementById("player-dealer").removeChild(document.getElementById("player-dealer").firstChild);
        }
        document.getElementById("bob-dealer").appendChild(token);
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
    document.getElementById("dealer-cards").innerText = "";
    document.getElementById("your-cards").innerText = "";
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

async function clickCard() {
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
                    document.getElementById("header").innerText = "Bob will cut the deck";
                    setTimeout(function() {
                        cutDeck();
                    }, 3000);
                }
                else{
                    document.getElementById("header").innerText = "Cut the deck";
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
            await sleep(2000);
            if(bobsHand.length != 0 && playHand.length != 0){
                console.log("bobsHand.length != 0 && playHand.length != 0");
                callDealerPlay();
            }
            if(bobsHand.length != 0 && playHand.length == 0){
                console.log("bobsHand.length != 0 && playHand.length == 0");
                while(bobsHand.length != 0){
                    callDealerPlay();
                }
            }
            if(bobsHand.length + playHand.length == 0){
                await sleep(2000);
                finishRound();
                return
            }
            if(bobsHand.length == 0){
                enableClicks();
            }
            this.removeEventListener('click', clickCard);
        }
    }
    // console.log(playHand);
    // console.log(bobsHand);
}

async function callDealerPlay(){
    if(checkPlayableCards(playHand) < 0 && checkPlayableCards(bobsHand) < 0){
        console.log("checkPlayableCards(playerHand) < 0 && checkPlayableCards(bobsHand) < 0");
        if(isPlayerLastPlay){
            if(playCount == 31){
                playerPoints.add(1);
            }
            playerPoints.add(1);
            document.getElementById("header").innerText = "You get the Go!";
        }
        else{
            if(playCount == 31){
                dealerPoints.add(1);
            }
            dealerPoints.add(1);
            document.getElementById("header").innerText = "Bob gets the Go!";
        }
        await sleep(2000);
        playCount = 0;
        document.getElementById("play-sum").innerText = playCount;
        await sleep(1000);
    }
    result =  dealerPlay();
    if (result != 0){
        playCount += result;
        dealerPoints.add(checkPlayPoints());
        document.getElementById("play-sum").innerText = playCount;
    }
    if(bobsHand.length + playHand.length == 0){
        setTimeout(function() {
            finishRound();
            return
        }, 2000);
    }
    if(checkPlayableCards(playHand) < 0 && checkPlayableCards(bobsHand) < 0){
        console.log("checkPlayableCards(playerHand) < 0 && checkPlayableCards(bobsHand) < 0");
        if(isPlayerLastPlay){
            if(playCount == 31){
                playerPoints.add(1);
            }
            playerPoints.add(1);
            document.getElementById("header").innerText = "You get the Go!";
            callDealerPlay();
        }
        else{
            if(playCount == 31){
                dealerPoints.add(1);
            }
            dealerPoints.add(1);
            document.getElementById("header").innerText = "Bob gets the Go!";
            enableClicks();
        }
        await sleep(2000);
        playCount = 0;
        document.getElementById("play-sum").innerText = playCount;
        await sleep(1000);
    }
    enableClicks();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    playerPoints.add(checkPlayPoints());
    }, 100);
}

function checkPlayPoints(){
    let points = 0;
    if(playCount == 15){
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
        document.getElementById("header").innerText = "Bob will play first";
        setTimeout(function() {
            playCount += dealerPlay();
            playedCards += 1;
            document.getElementById("play-sum").innerText = playCount;
        }, 2000);
    }
    setTimeout(function() {
        enableClicks();
        document.getElementById("header").innerText = "Click a card to play it";
        document.getElementById("deckImage").removeEventListener('click', cutDeck);
    }, 3000);
}

function animateCardMovement(card, location){
    const rect = card.getBoundingClientRect();
    const containerRect = document.getElementById(location).getBoundingClientRect();
    // const containerCenterX = containerRect.width / 2; 
    // const offsetX = containerCenterX - rect.width / 2 - rect.left + (100 * playedCards/2);
    // const offsetY = containerRect.top - rect.top;
    // card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
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
        console.log("dealer play");
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

async function finishRound(){
    if(isPlayerLastPlay){
        if(playCount == 31){
            playerPoints.add(1);
        }
        playerPoints.add(1);
        document.getElementById("header").innerText = "You get the Go!";
    }
    else{
        if(playCount == 31){
            dealerPoints.add(1);
        }
        dealerPoints.add(1);
        document.getElementById("header").innerText = "Bob gets the Go!";
    }
    document.getElementById("dealer-cards").innerText = "";
    document.getElementById("crib-cards").innerText = "";
    document.getElementById("your-cards").innerText = "";
    document.getElementById("the-play").innerText = "";
    for(let i = 0; i < 4; i++){
        cardImg = document.createElement("img");
        cardImg.src = "./cards/" + dealerHand[i] + ".png";
        document.getElementById("dealer-cards").appendChild(cardImg);

        cardImg = document.createElement("img");
        cardImg.src = "./cards/" + cribHand[i] + ".png";
        document.getElementById("crib-cards").appendChild(cardImg);

        cardImg = document.createElement("img");
        cardImg.src = "./cards/" + playerHand[i] + ".png";
        document.getElementById("your-cards").appendChild(cardImg);
    }
    points = countpoints(playerHand);
    document.getElementById("header").innerText = "You hand has " + points + " points";
    await sleep(2000);
    playerPoints.add(countpoints(playerHand));
    points = countpoints(dealerHand);
    document.getElementById("header").innerText = "Bob's hand has " + points + " points";
    await sleep(2000);
    dealerPoints.add(countpoints(dealerHand));
    points = countpoints(cribHand);
    if(isPlayerDealer){
        document.getElementById("header").innerText = "You get " + points + " points from the Crib";
    }
    else{
        document.getElementById("header").innerText = "Bob gets " + points + " from the Crib";
    }
    await sleep(2000); 
    if(isPlayerDealer){
        playerPoints.add(countpoints(cribHand));
    }
    else{
        dealerPoints.add(countpoints(cribHand));
    }
    isPlayerDealer = !isPlayerDealer;
    enableClicks();
    document.getElementById("button-text").innerText = "start next round";
    document.getElementById("button").addEventListener("click", startGame);
}

function finishGame(){
    console.log("finish game");
    modal = document.getElementById('modal');
    modal.classList.add('activemodal');
    modal.classList.remove('inactivemodal');
    console.log(modal.classList);
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
