// ELEMENTS
const gameContainer = document.querySelector('#gameContainer');
const gameContent = document.querySelector('#gameContent');
const columnSelector = document.querySelector('#gameContainer');
const scoreAndTurnContainer = document.querySelector('#scoreAndTurnContainer');
const linksContainer = document.querySelector('#linksContainer');
const bannerContainer = document.querySelector('#bannerContainer');

// VARIABLES
let board = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '']
];

let enableIntercept = true;

let playerATurn = true;

let playsCount = 0;
const scoreBoard = {
    'playerA': 0,
    'playerB': 0,
    'draw': 0
}

const nextPlayerObj = {
    'playerAturn': ['playerB'],
    'playerBturn': ['playerA']
}

// FUNCTIONS
const createBoard = () => {
    for (let col = 0; col < 7; col++) {
        const columnElement = document.createElement('section');
        columnElement.classList.add('column');
        for (let row = 0; row < 6; row++) {
            const rowElement = document.createElement('div');
            rowElement.classList.add('cell');
            rowElement.setAttribute('data-column', col);
            rowElement.setAttribute('data-row', row)
            columnElement.appendChild(rowElement);
        }
        gameContainer.appendChild(columnElement);
    }
}

const intercept = (evt) => {
    if (enableIntercept) {
        const columnClick = evt.target;

        if (columnClick.tagName === 'DIV' || columnClick.tagName === 'IMG') {

            let columnSelected = columnClick.closest('.column');
            let emptyCell = findEmptyCell(columnSelected);
            implementDisk(emptyCell);
            boardUpdated('itemId');
            haveWinner(emptyCell);
            changeTurnSectionInfo(emptyCell);
            changeScoreSectionInfo();
        }
    }
}

const haveWinner = (emptyCell) => {
    let message;
    if (victoryHorizontal() || victoryVertical(emptyCell) || diagonalVictory(emptyCell)) {
        let winner = emptyCell.getAttribute('data-player');
        message = createMessage(winner);
        scoreBoard[winner]++;
        enableIntercept = false;
    } else if (playsCount === 42) {
        message = createMessage('draw');
        scoreBoard['draw']++;
    }
    if (message !== undefined) {
        message.classList.add('slideUp');
        gameContainer.appendChild(message);
    }
}

const createPlayerDisk = () => {
    const player = document.createElement('div');
    const image = document.createElement('img');
    player.classList.add('slideDown');
    if (playerATurn) {
        player.classList.add('player');
        player.id = 'playerA';
        image.src = playerSelect['playerA']['diskSrc'];
        image.classList.add('image__disk');
        playerATurn = false;
    } else {
        player.classList.add('player');
        player.id = 'playerB';
        image.src = playerSelect['playerB']['diskSrc'];
        image.classList.add('image__disk');
        playerATurn = true;
    }
    player.appendChild(image);
    return player;
}

const implementDisk = (emptyCell) => {
    if (emptyCell !== undefined) {
        playsCount++;
        let player = createPlayerDisk();
        emptyCell.setAttribute('data-player', player.id);
        emptyCell.appendChild(player.cloneNode(true));
    }
}

const boardUpdated = (selection) => {
    const $column = document.querySelectorAll('.column');
    for (let i = 0; i < $column.length; i++) {

        for (let k = 0; k < $column[i].childNodes.length; k++) {

            if ($column[i].childNodes[k].childElementCount !== 0) {
                let diskInColumn = $column[i].childNodes[k].childNodes;

                diskInColumn.forEach((item) => {
                    const select = {
                        'itemId': item.id,
                        'erase': ''
                    }

                    if (item !== undefined) {
                        return board[k][i] = select[selection];
                    }
                });
            }
        }
    }
}

const findEmptyCell = (element) => {
    let arrayChild = element.childNodes;
    let emptyCell;
    for (let i = arrayChild.length - 1; i >= 0; i--) {

        if (arrayChild[i].childNodes.length === 0) {
            emptyCell = arrayChild[i];
        }
    }
    return emptyCell;
}

const victoryHorizontal = () => {
    let victory = false;
    for (let i = board.length - 1; i >= 0; i--) {
        let seq = board[i].join();
        if (seq.match(/(playerA,playerA,playerA,playerA)/g) || seq.match(/(playerB,playerB,playerB,playerB)/g)) {
            victory = true;
        }
    }
    return victory;
}

const victoryVertical = (element) => {
    let victory = false;
    if (element !== undefined) {

        let column = element.getAttribute('data-column');
        let arrColumn = [];
        for (let i = 0; i < 6; i++) {
            arrColumn.push(board[i][column]);
        }
        let strColumn = arrColumn.join();
        if (strColumn.match(/(playerA,playerA,playerA,playerA)/g) || strColumn.match(/(playerB,playerB,playerB,playerB)/g)) {
            victory = true;
        }
    }
    return victory;
}

const checkDiagonals = (element, side) => {
    if (element !== undefined) {
        let row = Number(element.getAttribute('data-row'));
        let column = Number(element.getAttribute('data-column'));
        let player = element.getAttribute('data-player');
        let maxNum = 6;
        let matches = [];
        for (let i = -maxNum; i <= maxNum; i++) {
            let elementColumn = {
                'right': column + i,
                'left': column - i
            }
            actualElement = document.querySelector(`[data-row='${row + i}'][data-column='${elementColumn[side]}']`);
            if (actualElement !== null) {
                let elementPlay = actualElement.getAttribute('data-player');
                if (player === elementPlay) {
                    matches.push(Number(actualElement.getAttribute('data-column')));
                }
            }
        }
        return matches;
    }
}

const checkSequences = (arrSequence) => {
    if (arrSequence !== undefined) {
        let sequence = false;
        let sortedSequence = arrSequence.sort((num1, num2) => num1 - num2);
        for (let i = 0; i < arrSequence.length; i++) {
            let number = Number(sortedSequence[i]);
            let arr = [number, number + 1, number + 2, number + 3];
            let matchNum = [];
            arr.forEach(num => {
                if (sortedSequence.includes(num)) {
                    matchNum.push(num);
                }
            });
            if (matchNum.length === 4) {
                sequence = true;
            }
        }
        return sequence;
    }
}

const diagonalVictory = (emptyCell) => {
    let diagonalRight = checkDiagonals(emptyCell, 'right');
    let diagonalLeft = checkDiagonals(emptyCell, 'left');
    let victory = false;
    if (checkSequences(diagonalLeft) || checkSequences(diagonalRight)) {
        victory = true;
    }
    return victory;
}

const createMessage = (selection) => {
    const messageContainer = document.createElement('section');
    const messageTitle = document.createElement('h3');
    const messagePlayer = document.createElement('span');
    const messageButton = document.createElement('button');
    const banner = document.createElement('img');
    const modal = document.createElement('div');

    messageTitle.classList.add('message__title');
    messagePlayer.classList.add('message__player');
    modal.classList.add('message__modal');

    if (selection === 'draw') {
        messageContainer.classList.add('message-container', 'message-container--draw');
        messageButton.classList.add('message__button', 'message__button--draw');
        messageTitle.innerHTML = `Empatou!`;
    } else {
        banner.src = [playerSelect[selection]['bannerSrc']];
        banner.classList.add('message__banner', 'slideUp');

        let houseClass = playerSelect[selection]['className'];

        messageContainer.classList.add('message-container', `message-container${houseClass}`);
        messageButton.classList.add('message__button', `message__button${houseClass}`);
        messagePlayer.innerText = `<span class="message__player">${playerSelect[selection]['name']}</span>`;
        messageTitle.innerHTML = `A casa ${messagePlayer.innerText} venceu!!`;
        bannerContainer.appendChild(banner)
    }

    messageButton.innerText = 'Jogar novamente';

    messageButton.addEventListener('click', resetGame);

    gameContainer.appendChild(modal);
    messageContainer.appendChild(messageTitle);
    messageContainer.appendChild(messageButton);
    return messageContainer;
}

const resetGame = () => {
    gameContainer.innerHTML = '';
    bannerContainer.innerHTML = '';
    enableIntercept = true;
    createBoard();
    boardUpdated('erase');
    playsCount = 0;
    board = [
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '']
    ];
}

const turnSection = () => {
    const turnSection = document.createElement('section');
    const paragraph = document.createElement('p');
    const player = document.createElement('p');
    const playerDisk = document.createElement('div');
    const imageDisk = document.createElement('img');

    turnSection.id = 'turnSection';
    paragraph.id = 'turnParagraph';
    player.id = 'turnPlayer';
    playerDisk.id = 'turnDisk';
    imageDisk.id = 'imageDisk';

    let playerA = playerSelect['playerA'];
    let playerAHouseClass = playerSelect['playerA']['className'];

    imageDisk.src = playerA['diskSrc'];
    imageDisk.classList.add('image__disk');
    turnSection.classList.add('turn__container', `turn__container${playerAHouseClass}`);
    paragraph.classList.add('turn__paragraph');
    player.classList.add('turn__paragraph', 'turn__player');
    playerDisk.classList.add('player', 'turn__disk');

    paragraph.innerText = 'Turno dos ';
    player.innerText = playerA['name'];

    playerDisk.appendChild(imageDisk);

    turnSection.appendChild(paragraph);
    turnSection.appendChild(player);
    turnSection.appendChild(playerDisk);
    scoreAndTurnContainer.appendChild(turnSection);
}

const changeTurnSectionInfo = (emptyCell) => {
    const turnContainer = document.querySelector('#turnSection');
    const player = document.querySelector('#turnPlayer');
    const imageDisk = document.querySelector('#imageDisk');

    let playerTurn = emptyCell.getAttribute('data-player');
    let turnHouseClass = playerSelect[playerTurn]['className'];
    let nextPlayer = nextPlayerObj[playerTurn + 'turn'][0];
    let nextHouseClass = playerSelect[nextPlayer]['className'];

    turnContainer.classList.remove(`turn__container${turnHouseClass}`);
    turnContainer.classList.add(`turn__container${nextHouseClass}`);

    imageDisk.src = playerSelect[nextPlayer]['diskSrc'];

    let newPlayer = playerSelect[nextPlayer]['name'];
    player.innerHTML = newPlayer;
}

const scoreSection = () => {
    const scoreContainer = document.createElement('section');
    const playerATitle = document.createElement('h3');
    const drawTitle = document.createElement('h3');
    const playerBTitle = document.createElement('h3');
    const scoresContainer = document.createElement('section');
    const playerAScore = document.createElement('p');
    const drawScore = document.createElement('p');
    const playerBScore = document.createElement('p');

    scoreContainer.classList.add('score__container');
    playerATitle.classList.add('score__title');
    drawTitle.classList.add('score__title');
    playerBTitle.classList.add('score__title');
    scoresContainer.classList.add('score__scores');
    playerAScore.classList.add('score__points');
    drawScore.classList.add('score__points');
    playerBScore.classList.add('score__points');

    scoresContainer.appendChild(playerAScore);
    scoresContainer.appendChild(drawScore);
    scoresContainer.appendChild(playerBScore);

    scoreContainer.appendChild(playerATitle);
    scoreContainer.appendChild(drawTitle);
    scoreContainer.appendChild(playerBTitle);
    scoreContainer.appendChild(scoresContainer);

    playerATitle.id = 'playerATitle';
    drawTitle.id = 'drawTitle';
    playerBTitle.id = 'playerBTitle';

    playerAScore.id = 'playerAScore';
    drawScore.id = 'drawScore';
    playerBScore.id = 'playerBScore';

    playerATitle.innerText = playerSelect['playerA']['name'];
    drawTitle.innerText = 'Empates';
    playerBTitle.innerText = playerSelect['playerB']['name'];

    playerAScore.innerText = 0;
    drawScore.innerText = 0;
    playerBScore.innerText = 0;

    scoreAndTurnContainer.appendChild(scoreContainer);
}

const changeScoreSectionInfo = () => {
    const playerAScore = document.querySelector('#playerAScore');
    const drawScore = document.querySelector('#drawScore');
    const playerBScore = document.querySelector('#playerBScore');

    playerAScore.innerText = scoreBoard['playerA'];
    drawScore.innerText = scoreBoard['draw'];
    playerBScore.innerText = scoreBoard['playerB'];
}

const createFooterContent = ({ name, linkedinHref, gitHubHref }) => {
    const socialContainer = document.createElement('section');
    const socialName = document.createElement('p');
    const socialLinkContainer = document.createElement('div');
    const linkedinLink = document.createElement('a');
    const linkedinIcon = document.createElement('i');
    const gitHubLink = document.createElement('a');
    const gitHubIcon = document.createElement('i');

    linkedinLink.setAttribute('href', linkedinHref);
    linkedinLink.setAttribute('target', '_blank');
    linkedinLink.setAttribute('rel', 'external');
    gitHubLink.setAttribute('href', gitHubHref);
    gitHubLink.setAttribute('target', '_blank');
    gitHubLink.setAttribute('rel', 'external');

    socialName.innerText = name;

    socialContainer.classList.add('social__container');
    socialName.classList.add('social__name');
    socialLinkContainer.classList.add('social__linkContainer');
    linkedinLink.classList.add('social__link');
    gitHubLink.classList.add('social__link');
    linkedinIcon.classList.add('fab', 'fa-linkedin', 'social__icon');
    gitHubIcon.classList.add('fab', 'fa-github-square', 'social__icon');

    linkedinLink.appendChild(linkedinIcon);
    gitHubLink.appendChild(gitHubIcon);
    socialLinkContainer.appendChild(linkedinLink);
    socialLinkContainer.appendChild(gitHubLink);
    socialContainer.appendChild(socialName);
    socialContainer.appendChild(socialLinkContainer);
    return socialContainer;
}

const implementFooterInfo = () => {
    for (let i = 0; i < teamInfo.length; i++) {
        let socialContent = createFooterContent(teamInfo[i]);
        linksContainer.appendChild(socialContent);
    }
}

const startGame = () => {
    gameContent.classList.remove('hidden');
    playerSelectionContainer.classList.add('hidden');
    createBoard();
    turnSection();
    scoreSection();
}

// EVENT LISTENERS
choiceContainer.addEventListener('click', selectHouse);
columnSelector.addEventListener('click', intercept);

// FUNCTION CALL

implementFooterInfo();