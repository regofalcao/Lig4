const playerSelectionContainer = document.querySelector('#playerSelectionContainer');
const choiceContainer = document.querySelector('#choiceContainer');
const choiceContainerPlayerA = document.querySelector('#playerContainerA');
const choiceContainerPlayerB = document.querySelector('#playerContainerB');
const choiceNamePlayerA = document.querySelector('#choicePlayerA');
const choiceNamePlayerB = document.querySelector('#choicePlayerB');
const choiceDiskPlayerA = document.querySelector('#playerASelection');
const choiceDiskPlayerB = document.querySelector('#playerBSelection');
const choicesTitle = document.querySelector('#choicesTitle');
const playerSelectionChoicesContainer = document.querySelector('#playerSelectionChoicesContainer');

let selections = {
    'playerA': undefined,
    'playerB': undefined
}

const playerSelect = {
    'playerA': {
        'choiceContainer': choiceContainerPlayerA,
        'choiceName': choiceNamePlayerA,
        'choiceDisk': choiceDiskPlayerA,
    },
    'playerB': {
        'choiceContainer': choiceContainerPlayerB,
        'choiceName': choiceNamePlayerB,
        'choiceDisk': choiceDiskPlayerB,
    }
}

const selectHouse = (event) => {
    if (event.target.tagName === 'DIV' || event.target.tagName === 'IMG') {
        let selection = event.target.closest('div').id
        if (selections['playerA'] === undefined) {
            selections['playerA'] = selection;
            createPlayerObject('playerA', selection);
            event.target.closest('div').classList.add('choice__disk--selected');
            event.target.closest('img').classList.add('choice__disk--selected');
            choicesTitle.innerText = 'Jogador 2'
        } else if (selections['playerB'] === undefined) {
            if (selections['playerA'] !== selection) {
                selections['playerB'] = selection;
                createPlayerObject('playerB', selection);
                event.target.closest('div').classList.add('choice__disk--selected');
                event.target.closest('img').classList.add('choice__disk--selected');
                implementStartButton();
            } else {
                console.log('ERRO');
            }
        }
    }
}

const createPlayerObject = (player, selection) => {
    const { name, className, diskSrc, bannerSrc } = housesInfo[selection];
    playerSelect[player].name = name;
    playerSelect[player].className = className;
    playerSelect[player].diskSrc = diskSrc;
    playerSelect[player].bannerSrc = bannerSrc;
    implementSelectionInfo(player);
}

const implementSelectionInfo = (player) => {
    const { name, diskSrc, className } = playerSelect[player];
    let playerSelected = playerSelect[player];
    playerSelected['choiceName'].innerText = name;
    playerSelected['choiceDisk'].setAttribute('src', diskSrc);
    playerSelected['choiceDisk'].alt = name;
    playerSelected['choiceContainer'].classList.add(`player__container${className}`);
}

const implementStartButton = () => {
    playerSelectionChoicesContainer.innerHTML = '';
    const startButton = document.createElement('button');
    startButton.classList.add('choices__startButton');
    startButton.innerText = 'Iniciar Batalha';

    startButton.addEventListener('click', startGame);

    playerSelectionChoicesContainer.appendChild(startButton);
}