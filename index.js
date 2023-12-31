
const cardObjectDefinitions = [
    {id:1, imagePath:"./Images/card-KingHearts.png"},
    {id:2, imagePath:"./Images/card-JackClubs.png"},
    {id:3, imagePath:"./Images/card-QueenDiamonds.png"},
    {id:4, imagePath:"./Images/card-AceSpades.png"}
]

const cardBackImgPath = './Images/card-back-blue.png'
const cardContainerElem = document.querySelector('.card-container')
const playGameButtonElem = document.getElementById('playGame')
const collapsedGridAreaTemplate = '"a a" "a a"'
const cardCollectionCellClass = '.card-pos-a'
const numCards = cardObjectDefinitions.length
const aceId = 4

const currentGameStatusElem = document.querySelector('.current-status')
const scoreContainerElem = document.querySelector('.header-score-container')
const scoreElem = document.querySelector('.score')
const roundContainerElem = document.querySelector('.header-round-container')
const roundElem = document.querySelector('.round')

const winColor = 'green'
const loseColor = 'red'
const primaryColor = 'black'

let roundNum = 0
let score = 0
const maxRounds = 4

let cards = []
let cardPositions = []

let gameInProgress = false
let shufflingInProgress = false
let cardsRevealed = false

loadGame()

function gameOver(){
    updateStatusElement(scoreContainerElem, 'none')
    updateStatusElement(roundContainerElem, 'none')

    const gameOverMessage = `Game Over! Final Score - <span class = 'badge'>${score}</span> Click 'Play Game' to play again`
    updateStatusElement(currentGameStatusElem, 'block', primaryColor, gameOverMessage)
    playGameButtonElem.disabled = false
}
function endRound(){
    setTimeout(() => {
        if(roundNum >= maxRounds){
            gameOver()
            return
        }
        else{
            startRound()
        }
    }, 3000);
}
function chooseCard(card){
    if(canChooseCard()){
        evaluateCardChoice(card)
        flipCard(card, false)
        setTimeout(() => {
            flipCards(false)
            updateStatusElement(currentGameStatusElem, 'block', primaryColor, "Card positions revealed")
            endRound()
        }, 3000)
        cardsRevealed = true
    }
}

function calculateScoreToAdd(roundNum){
    if(roundNum == 1){return 100}
    else if(roundNum == 2){return 50}
    else if(roundNum == 3){return 25}
    else{return 10}
}
function calculateScore(){
    const scoreToAdd = calculateScoreToAdd(roundNum)
    score = score + scoreToAdd
}
function updateScore(){
    calculateScore()
    updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`)
}
function updateStatusElement(elem, display, color, innerHTML){
    elem.style.display = display
    if(arguments.length > 2){
        elem.style.color = color
        elem.innerHTML = innerHTML
    }
}
function outputChoiceFeedback(hit){
    if(hit){
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit! - Well Done!")
    }
    else{
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!")
    }
}
function evaluateCardChoice(card){
    if(card.id == aceId){
        updateScore()
        outputChoiceFeedback(true)
    }
    else{
        outputChoiceFeedback(false)
    }
}
function canChooseCard(){
    return gameInProgress == true && !shufflingInProgress && !cardsRevealed
}

function loadGame(){
    createCards()

    cards = document.querySelectorAll('.card')
    cardFlyInEffect()

    playGameButtonElem.addEventListener('click', ()=>startGame())

    updateStatusElement(scoreContainerElem, 'none')
    updateStatusElement(roundContainerElem, 'none')
}
function startGame(){
    initializeNewGame()
    startRound()
}
function initializeNewGame(){
    score = 0
    roundNum = 0
    shufflingInProgress = false

    updateStatusElement(scoreContainerElem, 'flex')
    updateStatusElement(roundContainerElem, 'flex')
    updateStatusElement(scoreElem,"block",primaryColor,`Score <span class='badge'>${score}</span>`)
    updateStatusElement(roundElem,"block",primaryColor,`Round <span class='badge'>${roundNum}</span>`)
}
function startRound(){
    initializeNewRound()
    collectCards()
    flipCards(true)
    shuffleCards()
}
function initializeNewRound(){
    roundNum++
    playGameButtonElem.disabled = true

    gameInProgress = true
    shufflingInProgress = true
    cardsRevealed = false

    updateStatusElement(currentGameStatusElem, 'block', primaryColor, "Shuffling...")
    updateStatusElement(roundElem, "block", primaryColor, `Round <span class='badge'>${roundNum}</span>`)
}

function collectCards(){
    transformGridArea(collapsedGridAreaTemplate)
    addCardsToGridAreaCell(cardCollectionCellClass)
}
function transformGridArea(areas){
    cardContainerElem.style.gridTemplateAreas = areas
}
function addCardsToGridAreaCell(cellPositionClassName){
    const cellPositionElem = document.querySelector(cellPositionClassName)
    cards.forEach((card, index)=>{
        addChildElement(cellPositionElem, card)
    })
}

function flipCard(card, flipToBack){
    const innerCardElem = card.firstChild
    if(flipToBack && !innerCardElem.classList.contains('flip-it')){
        addClassToElement(innerCardElem, 'flip-it')
    }
    else if(innerCardElem.classList.contains('flip-it')){
        innerCardElem.classList.remove('flip-it')
    }
}
function flipCards(flipToBack){
    cards.forEach((card,index)=>{
        setTimeout(()=>{
            flipCard(card, flipToBack)
        }, index*100)
    })
}

function cardFlyInEffect(){
    const id = setInterval(flyIn, 5)
    let cardCount = 0
    let count = 0

    function flyIn(){
        count++
        if(cardCount == numCards){
            clearInterval(id)
            playGameButtonElem.style.display = "inline-block"            
        }
        if(count == 1 || count == 250 || count == 500 || count == 750){
            cardCount++
            let card = document.getElementById(cardCount)
            card.classList.remove("fly-in")
        }
    }
}
function removeShuffleClasses(){
    cards.forEach((card)=>{
        card.classList.remove('shuffle-left')
        card.classList.remove('shuffle-right')
    })
}
function animateShuffle(shuffleCount){
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1

    let card1 = document.getElementById(random1)
    let card2 = document.getElementById(random2)

    if(shuffleCount % 4 == 0){
        card1.classList.toggle('shuffle-left')
        card1.style.zIndex = 100
    }
    if(shuffleCount % 10 == 0){
        card2.classList.toggle('shuffle-right')
        card2.style.zIndex = 200
    }
}

function shuffleCards(){
    const id = setInterval(shuffle, 12)
    let shuffleCount = 0
    function shuffle(){
        randomizeCardPositions()
        animateShuffle(shuffleCount)
        if(shuffleCount == 500){
            clearInterval(id)
            shufflingInProgress = false
            removeShuffleClasses()
            dealCards()
            updateStatusElement(currentGameStatusElem, 'block', primaryColor, "Find the Ace of Spades!")
        }
        else{
            shuffleCount++
        }
    }
}
function randomizeCardPositions(){
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1

    const temp = cardPositions[random1 - 1]

    cardPositions[random1 - 1] = cardPositions[random2 - 1]
    cardPositions[random2 - 1] = temp
}
function dealCards(){
    addCardsToAppropriateCell()
    const areasTemplate = returnGridAreasMappedToCardPos()

    transformGridArea(areasTemplate)
}
function addCardsToAppropriateCell(){
    cards.forEach((card)=>{
        addCardToGridCell(card)
    })
}
function returnGridAreasMappedToCardPos(){
    let firstPart = ""
    let secondPart = ""
    let areas = ""

    cards.forEach((card, index) => {
        if(cardPositions[index] == 1)
        {
            areas = areas + "a "
        }
        else if(cardPositions[index] == 2)
        {
            areas = areas + "b "
        }
        else if (cardPositions[index] == 3)
        {
            areas = areas + "c "
        }
        else if (cardPositions[index] == 4)
        {
            areas = areas + "d "
        }
        if (index == 1)
        {
            firstPart = areas.substring(0, areas.length - 1)
            areas = "";
        }
        else if (index == 3)
        {
            secondPart = areas.substring(0, areas.length - 1)
        }

    })

    return `"${firstPart}" "${secondPart}"`
}

function createCards(){
    cardObjectDefinitions.forEach((cardItem)=>{
        createCard(cardItem)
    })
}

function createCard(cardItem){
    const cardElem = createElement('div')
    const cardInnerElem = createElement('div')
    const cardFrontElem = createElement('div')
    const cardBackElem = createElement('div')

    const cardFrontImg = createElement('img')
    const cardBackImg = createElement('img')

    addClassToElement(cardElem, 'card')
    addClassToElement(cardElem, 'fly-in')
    addIdToElement(cardElem, cardItem.id)

    addClassToElement(cardInnerElem, 'card-inner')
    addClassToElement(cardFrontElem, 'card-front')
    addClassToElement(cardBackElem, 'card-back')

    addSrcToImageElement(cardBackImg, cardBackImgPath)
    addSrcToImageElement(cardFrontImg, cardItem.imagePath)

    addClassToElement(cardBackImg, 'card-img')
    addClassToElement(cardFrontImg, 'card-img')

    addChildElement(cardBackElem, cardBackImg)
    addChildElement(cardFrontElem, cardFrontImg)

    addChildElement(cardInnerElem, cardBackElem)
    addChildElement(cardInnerElem, cardFrontElem)

    addChildElement(cardElem, cardInnerElem)

    addCardToGridCell(cardElem)

    initializeCardPositions(cardElem)
    attachClickEventHandlerToCard(cardElem)
}

function attachClickEventHandlerToCard(card){
    card.addEventListener('click', () => chooseCard(card))
}
function initializeCardPositions(card){
    cardPositions.push(card.id)
}
function createElement(elemType){
    return document.createElement(elemType)
}
function addClassToElement(elem, className){
    elem.classList.add(className)
}
function addIdToElement(elem, id){
    elem.id = id
}
function addSrcToImageElement(imgElem, src){
    imgElem.src = src
}
function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem)
}
function addCardToGridCell(card){
    const cardPositionClassName = mapCardToGridCell(card)
    const cardPosElem = document.querySelector(cardPositionClassName)
    addChildElement(cardPosElem, card)
}
function mapCardToGridCell(card){
    if(card.id == 1){
        return '.card-pos-a'
    }
    else if(card.id == 2){
        return '.card-pos-b'
    }
    else if(card.id == 3){
        return '.card-pos-c'
    }
    else if(card.id == 4){
        return '.card-pos-d'
    }
}