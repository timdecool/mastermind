const container = document.querySelector('#container');

// Paramètres partie
let rowNbr = 10;
let slotNbr = 4;
let colorOptions = 4;
let colors = ['slot-yellow','slot-red','slot-blue','slot-green'];
let solution = [];

// Suivi partie
let currentRow = 0;

function generateLayout() {
    // On crée l'espace jeu
    const game = document.createElement('section');
    container.appendChild(game);
    game.classList.add('game');

    for (let i = 0; i < rowNbr; i++) {
        // On crée une ligne
        const row = document.createElement('article');
        game.appendChild(row);
        row.classList.add('row')

        // On y ajoute le numéro de la ligne
        const step = document.createElement('p');
        step.textContent = `${rowNbr - i}. `;
        row.appendChild(step);

        // On y ajoute la section correction
        const correction = document.createElement('div');
        correction.classList.add('correction');

        // On crée les slots d'essai et les slots de correction
        for (let j=0; j < slotNbr; j++) {
            const slot = document.createElement('div');
            slot.setAttribute('data-color', colorOptions);
            row.appendChild(slot);
            slot.classList.add('slot');
            slot.classList.add('slot-lg');
            const correctionSlot = document.createElement('div');
            correction.appendChild(correctionSlot);
            correctionSlot.classList.add('slot-sm');
            correctionSlot.classList.add('slot');
        }
        row.appendChild(correction);
        const btn = document.createElement('button');
        row.appendChild(btn);
        btn.textContent = "Valider";
        btn.disabled = true;
    }
}

function nextRow() {
    currentRow++;
    for(let i=1; i<5; i++) {
        // Les cases de la ligne actuelle deviennent cliquables
        container.children[0].children[rowNbr-currentRow].children[i].classList.add('clickable');
        container.children[0].children[rowNbr-currentRow].children[i].addEventListener('click', changeSlotColor);
        if (currentRow != 1) { // Si besoin, celles de la ligne précédente sont désactivées
            container.children[0].children[rowNbr-currentRow+1].children[i].classList.remove('clickable');
            container.children[0].children[rowNbr-currentRow+1].children[i].removeEventListener('click', changeSlotColor);
            container.children[0].children[rowNbr-currentRow+1].children[6].disabled = true;
        }
    }

}

function changeSlotColor(e) {
    let slot = e.currentTarget;
    if (slot.dataset.color != colorOptions) slot.classList.remove(colors[slot.dataset.color]);
    if (slot.dataset.color >= colorOptions -1) {
        slot.dataset.color = 0;
    } else {
        slot.dataset.color++;
    }
    slot.classList.add(colors[slot.dataset.color]);
    activateBtn();
}

function activateBtn() {
    let rowCompleted = true;
    for(let i=1; i<5; i++) {
        if(container.children[0].children[rowNbr-currentRow].children[i].dataset.color == 4) {
            rowCompleted = false;
        }
    }
    if (rowCompleted) {
        container.children[0].children[rowNbr-currentRow].children[6].disabled = false;
        container.children[0].children[rowNbr-currentRow].children[6].addEventListener('click', checkSolution);
    }
}

function checkSolution() {
    let placed = 0;
    let misplaced = 0;
    let playerSolution = [];
    let foundColors = [];

    // On met la proposition du joueur dans un tableau
    for(let i=1; i<5; i++) {
        playerSolution.push(parseInt(container.children[0].children[rowNbr-currentRow].children[i].dataset.color)); 
    }

    // On fait un premier tour des tableaux pour les couleurs placées
    for(let i=0; i<solution.length; i++) {
        if(solution[i] == playerSolution[i]) { 
            placed++;
            foundColors.push(playerSolution[i]);
        }
    }

    // Second tour pour les couleurs mal placées
    for(let i=0; i<solution.length; i++) {
        // Si la couleur est dans la solution mais pas à cette position
        if(solution.includes(playerSolution[i]) && solution[i] != playerSolution[i]) {
            // On compte le nombre d'occurrences dans la solution et dans les couleurs déjà trouvées
            let solutionCpt = 0;
            let foundColorsCpt = 0;
            for(let j=0; j<solution.length;j++) {
                if(solution[j] == playerSolution[i]) solutionCpt++;
                if(foundColors[j] == playerSolution[i]) foundColorsCpt++;
            }
            // Si le joueur n'a pas encore atteint le nombre d'occurrences de la couleur dans la solution, c'est donc que c'est mal placé
            if(foundColorsCpt < solutionCpt) {
                misplaced++;
                foundColors.push(playerSolution[i]);
            }
        }
    }

    // Affichage des résultats
    for(let i=0; i<placed+misplaced;i++) {
        container.children[0].children[rowNbr-currentRow].children[5].children[i].classList.add(`slot-${i < misplaced ? 'yellow':'red'}`);
    }

    // Si la combinaison est bonne ou que toutes les tentatives sont épuisées, fin de partie
    if(placed == 4 || currentRow == rowNbr) {
        endGame();
    } else {
        nextRow();
    }
}

function generateSolution() {
    for(let i=0; i<slotNbr;i++) {
        solution.push(Math.floor(Math.random()*colorOptions));
    }
}

(function startGame() {
    solution = [];
    currentRow = 0;
    generateSolution();
    generateLayout();
    nextRow();
})();

function endGame() {
    const endTitle = document.createElement("h2");
    endTitle.textContent = `C'est gagné !`;
    endTitle.classList.add('end-title');
    container.appendChild(endTitle);

}