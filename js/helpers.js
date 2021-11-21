// ***********   Helper functions   ***********

// ***********   Begin Game helper functions   ***********

// Function to check if playerObj is not empty before starting game
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
};

// Function to return random index of array
function randomizer(array) {
    return Math.floor(Math.random() * array.length)
};

// Function to clear select options
function clearOptions(parentNode) {
    while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
    }
};

// Function to find a certain key within our playersObj
function findKeyWithinPlayersObj(playersObj, keyToFind, callbackFn) {
    Object.keys(playersObj).forEach(player => {
        // Set currentPlayer to the player being iterated over right now
        let currentPlayer = playersObj[player];
        // Loop over each key in the currentPlayer
        Object.keys(currentPlayer).forEach(key => {
            // If the key is "territories",
            if (key === keyToFind) {
                // run a for loop over that territories array and...
                return callbackFn(playersObj, keyToFind);
            };
        });
    });
};

// Function to create select options for available colors at game start
function availableColors() {
    let colorSelect = document.getElementById("new-player-color");
    clearOptions(colorSelect);
    playerColors.forEach(color => {
        let colorValue = color.toLowerCase();
        let option = document.createElement("option");
        option.text = color;
        option.value = colorValue;
        colorSelect.add(option);
    });
};

// Function to change turn by changing data in our Game obj:
// changing the turnIndex
function changeTurn() {
    gameObj["turnIndex"] += 1;
    gameObj["numberOfTurns"] += 1;
    beginTurn();
}

// Function to update territories' info
function mapUpdate() {
    // Loop over each territory
    territories.forEach(terr => {
        // grab territory name and color from territories Obj
        let color = terr.color;
        let name = terr.name;
        let army = terr.army;
        // grab territory using DOM manipulation
        let territory = document.getElementById(name);
        let territorySpan = territory.getElementsByClassName("terr-span")[0];
        // change territory's color and border color to owner's color
        territory.style.color = color;
        territory.style.borderColor = color;
        territorySpan.innerHTML = army;
    });
};

// Function to update territories' owner in global territories object
function terrUpdate() {
    // Loop over each player in our Players object
    Object.keys(playersObj).forEach(player => {
        // Set currentPlayer to the player being iterated over right now
        let currentPlayer = playersObj[player];
        // Loop over each key in the currentPlayer
        Object.keys(currentPlayer).forEach(key => {
            // If the key is "territories",
            if (key == "territories") {
                // run a for loop over that territories array and...
                for (let i = 0; i < currentPlayer[key].length; i++) {
                    // run a for loop over our global territories array and...
                    for (let j = 0; j < territories.length; j++) {
                        // check to see if the territory is in the players array and...
                        if (territories[j].name == currentPlayer[key][i]) {
                            // change that territory's owner & color in territories array to the currentPlayer
                            territories[j].owner = currentPlayer.name;
                            territories[j].color = currentPlayer.color;
                        }
                    }
                }
            }
        });
    });

    // Call our function to update territories' colors
    return mapUpdate();
}

// Function to randomly distribute territories to players in playersObj,
// receiving the playersObj as a parameter
function mapDrop() {
    // Find how many players we have
    let numberOfPlayers = gameObj["numberOfPlayers"];
    // Initialize a copy of our territories array to splice from
    let tempTerritories = [...territories];
    // Set how many territories each player will have, leaving an equal unclaimed amount of territories
    let territoriesEach = Math.floor(tempTerritories.length / (numberOfPlayers + 1));

    // Loop over each player in our playerObj
    Object.keys(playersObj).forEach(player => {
        // set currentPlayer equal to this player
        let currentPlayer = playersObj[player];
        // loop over currentPlayer's keys
        Object.keys(currentPlayer).forEach(key => {
            // Find the territories key
            if (key == "territories") {
                // set a counter for our while loop, to give the required number of territories
                let counter = territoriesEach;

                while (counter > 0) {
                    // obtain random index of our tempTerritories array
                    let rdm = randomizer(tempTerritories);
                    // push that territory name into our player's territories array
                    currentPlayer[key].push(tempTerritories[rdm].name)
                    // remove that territory from our available pool
                    tempTerritories.splice(rdm, 1);
                    // decrement our counter to advance through while loop
                    counter -= 1;
                };
            };
        });
    });
    // return from this function by calling our terrUpdate function
    terrUpdate();
}

// ***********   Deploy helper functions   ***********

// Function to create select options for territories to deploy onto
function availableTerritories() {
    // Find our players territories as an array
    let territoriesToDeployOnto = playersObj[gameObj["playersTurn"]].territories.sort();

    // Grab our select id for deploying to territories dropdown
    let deployToTerritorySelect = document.getElementById("deploy-to-territory");
    clearOptions(deployToTerritorySelect);
    territoriesToDeployOnto.forEach(terr => {
        let option = document.createElement("option");
        option.text = terr;
        option.value = terr;
        deployToTerritorySelect.add(option);
    });
};

// Function to create select options for troop deployment
function availableTroops() {
    
    // Find out number of troops to deploy using our playersObj and gameObj data
    let troops = playersObj[gameObj["playersTurn"]].troopsToDeploy;

    // If we're done deploying (no more troops to deploy), call beginAttack() function
    if (troops === 0) {
        return;
    };

    // Using DOM manipulation to create options for our troop deployment select box
    let deployHowManyFormSelect = document.getElementById("deploy-how-many");
    clearOptions(deployHowManyFormSelect);
    let i = 1;
    while (i <= troops) {
        let option = document.createElement("option");
        option.text = i;
        option.value = i;
        deployHowManyFormSelect.add(option);
        i++;
    };
};

// Function to determine if player gets bonus troops to deploy, where param "ter" is players territory array
function bonusCheck(ter) {
    // Initialize bonus as zero
    let bonus = 0;
    // Check each continent's territories array against our player's territories array
    continents.forEach((continent) => {
        // If every territory in a continent is present in players territory array,
        if (continent.areas.every(elem =>
            ter.includes(elem)
        )) {
            // Add the continent's bonus to "bonus"
            bonus += continent.bonus;
        }
    });
    // Return this bonus amount back to our deploy function
    return bonus;
}

// Function to determine how many troops to deploy this turn
function deployHowMany() {

    // Find this.player
    let player = playersObj[gameObj["playersTurn"]];
    // Troops to deploy, initialized as zero
    let troops = 0;

    // Change troops based off # of territories - # of territories div by 3, with min. of 3
    if (player.territories.length > 11) {
        troops = Math.floor(player.territories.length / 3);
    } else {
        troops = 3;
    }

    // Determine if player gets a "continent" bonus for holding all territories in a room
    let bonus = bonusCheck(player.territories);

    troops += bonus;

    // Set players troopsToDeploy number
    player.troopsToDeploy = troops;

    return player.beginDeploy();
}

// ***********   Attack helper functions   ***********

// Function to create select options for troops to advance to conquered territory
// params are territoy objects from territories array
function advanceHowMany() {
    // Set number of troops to possibly advance
    let availableTroopsToAdvance = territories[attackObj["terrIndexOfAttacker"]].army - 1;

    // Using DOM manipulation to create options for our troop advancement select box
    let advanceHowManyFormSelect = document.getElementById("advance-how-many");
    clearOptions(advanceHowManyFormSelect);
    let i = 0;
    while (i <= availableTroopsToAdvance) {
        let option = document.createElement("option");
        option.text = i;
        option.value = i;
        advanceHowManyFormSelect.add(option);
        i++;
    };
}

// Function to create select options for territories to attack
function fillAttackableTerritories() {
    // Grab the value of our the last input to use as index for attackable territories
    let indexOfAttacker = document.getElementById("attack-from-territory").value;
    // Find our attackable territories as an array of territory names
    let territoriesCanBeAttacked = attackObj["attackableTerrs"][indexOfAttacker];
    // Add this information to our attackObj
    attackObj["attackingTerritoryIndex"] = indexOfAttacker;
    attackObj["att"] = attackObj["terrCanAttack"][indexOfAttacker].name;
    
    // Grab our select id for deploying to territories dropdown
    let attackTheseTerritoriesSelect = document.getElementById("attack-these-territories");
    clearOptions(attackTheseTerritoriesSelect);
    // loop over this array of territories and for each,
    territoriesCanBeAttacked.forEach(terr => {
        let option = document.createElement("option");
        // add name and value to our option, and 
        option.text = terr;
        option.value = terr;
        // add option to our Select form
        attackTheseTerritoriesSelect.add(option);
    });
};

// Function to create select options for territories to attack from
function fillAttackTerritories() {
    // Find our player's territories as an array of territory objects
    let territoriesToAttackFrom = attackObj["terrCanAttack"];
    // Grab our select id for deploying to territories dropdown
    let attackFromTerritorySelect = document.getElementById("attack-from-territory");
    // Clear out any old selectors, just in case
    clearOptions(attackFromTerritorySelect);
    // loop over each territory to list option, and put index as value to help with next function
    territoriesToAttackFrom.forEach(function callback(terr, index) {
        // create new option
        let option = document.createElement("option");
        // add name and value to option
        option.text = terr.name;
        option.value = index;
        // add option to our Select form
        attackFromTerritorySelect.add(option);
    });
};

// Function to change terrCanAttack based off whether there are neighbors able to be attacked
// accepts as params 1) array of objects (terr) that can attack, 
// and 2) array of arrays that are neighbors able to be attacked
function filterOutAttacking() {
    let tempTCA = attackObj["terrCanAttack"];
    let tempFAT = attackObj["attackableTerrs"];
    for (let i = 0; i < tempFAT.length; i++) {
        if (tempFAT[i].length === 0) {
            tempTCA.splice(i, 1);
            tempFAT.splice(i, 1);
            i -= 1;
        }
    }
    // update our attackObj with these arrays of territories
    attackObj["terrCanAttack"] = tempTCA;
    attackObj["attackableTerrs"] = tempFAT;
};

// Function to filter out territories player owns from territories that can be attacked
// accepts params of array of arrays, playername
function filterOutAlreadyOwned() {
    // For loop to get into each sub-array
    let allAttackableTerrs = attackObj["attackableTerrs"];
    let playerName = attackObj["attackerName"];
    for (let i = 0; i < allAttackableTerrs.length; i++) {
        // For loop to go over each item within each sub-array
        for (let j = 0; j < allAttackableTerrs[i].length; j++) {
            // temp variable to store the name of each terr. in each sub-array
            let terrName = allAttackableTerrs[i][j];
            // For loop to go over global territories array of objects
            for (let k = 0; k < territories.length; k++) {
                // if the name of the territory is the same as this attackable territory
                // and the owner of this territory matches the player name, then...
                if (territories[k].name === terrName && territories[k].owner === playerName) {
                    // remove this territory from the array
                    allAttackableTerrs[i].splice(j, 1);
                    // decrement j since we removed an item, 
                    // and subsequent items in that array now have a lower index
                    j -= 1;
                }
            }
        }
    }
    attackObj["attackableTerrs"] = allAttackableTerrs;
    // call next function
    return filterOutAttacking();
}

// Function to list array of arrays, where the secondary arrays are the territoriesthat are able to be attacked
function attackableTerritoriesCheck() {
    let attackableTerrs = [];
    attackObj["terrCanAttack"].forEach((attackingTerr) => {
        territories.filter((territory) => {
            if (attackingTerr.name === territory.name) {
                attackableTerrs.push(territory.neighbors);
            };
        });
    });
    attackObj["attackableTerrs"] = attackableTerrs;
    // call next function
    return filterOutAlreadyOwned();
}

// Function to find territories that can attack (where this.player is owner, and army > 1)
function findTerrCanAttack() {
    // Initialize empty array to hold this players territories that have more than 1 army (and so can attack)
    let terrCanAttack = [];
    
    // Loop over all territories - if this player is owner and it has army greater than 1,
    territories.forEach((terr) => {
        if (terr.owner === attackObj["attackerName"] && terr.army > 1) {
            // push this into our attack-able array
            terrCanAttack.push(terr)
        }
    });
    // Sort array so it's more visually appealing 
    terrCanAttack.sort();
    // Save array in our attackObj
    attackObj["terrCanAttack"] = terrCanAttack;
    // call next function
    return attackableTerritoriesCheck();
}

// Function to begin attacking phase & change Action Box, where param is playersObj.[name-of-player]
function beginAttack() {

    // Change displayMessage back (for after advancing)
    let displayMessage = document.getElementById("display-message");
    displayMessage.innerHTML = "Attack enemy territories";
    // Clear advance form, if it exists
    let advanceTroopsForm = document.getElementById("advance-form");
    advanceTroopsForm.style.display = "none";
    // Clear old select options in "attack-these-territories" selector
    let attackTheseTerritoriesSelect = document.getElementById("attack-these-territories");
    clearOptions(attackTheseTerritoriesSelect);

    let player = playersObj[gameObj["playersTurn"]];
    attackObj["attackerName"] = player.name; 
    // Call first in chain of helper functions using our attackObj
    findTerrCanAttack();
    /* DOM manipulation to change Action Box to attacking phase, 
    with drop down selection of territories from terrCanAttack */

    // DOM manipulation to hide deployTroops form
    let deployForm = document.getElementById("deploy-form");
    deployForm.style.display = "none";

    let attackForm = document.getElementById("attack-form");
    attackForm.style.display = "flex";

    // Call helper function to create options of territories to attack from
    fillAttackTerritories();
}

// Function to determine # of dice for attacker and defender & obtain their dice
function diceRoll(att, def) {

    // Number of dice each player will get
    let numAttDice, numDefDice;
    // Result object, a sorted array of dice rolls for each player
    attackObj["dice-roll-result"] = {
        "attacker-dice": [],
        "defender-dice": []
    };

    // Determining number of dice for each player - all armies count for defender dice,
    // but attacker dice is att.army minus 1 (1 troop has to "hold" territory attacking from)
    // Attacker
    if (att.army === 2) {
        numAttDice = 1;
    } else if (att.army === 3) {
        numAttDice = 2;
    } else {
        numAttDice = 3;
    }
    // Defender
    if (def.army === 1) {
        numDefDice = 1;
    } else {
        numDefDice = 2;
    }

    // Determining dice rolls and pushing to appropriate array
    for (var i = 1; i <= numAttDice; i++) {
        attackObj["dice-roll-result"]["attacker-dice"].push(Math.floor(Math.random() * 6 + 1))
    }
    for (var i = 1; i <= numDefDice; i++) {
        attackObj["dice-roll-result"]["defender-dice"].push(Math.floor(Math.random() * 6 + 1))
    }

    // Sorting and reversing dice-rolls arrays for comparison
    attackObj["dice-roll-result"]["attacker-dice"].sort().reverse();
    attackObj["dice-roll-result"]["defender-dice"].sort().reverse();

    // Display message with results
    let displayMessage = document.getElementById("display-message");
    displayMessage.innerHTML = `Dice results: ${attackObj["att"]} rolled ${attackObj["dice-roll-result"]["attacker-dice"]},
    and ${attackObj["def"]} rolled ${attackObj["dice-roll-result"]["defender-dice"]}`; 
}

// Function to remove a specific element from an array, for removing conquered territories from defender
function arrayRemove(arr, value) {
    return arr.filter(function(elem) {
        return elem != value;
    });
}

// Function to check for victory
function winCheck() {
    Object.keys(playersObj).forEach(player => {
        // Set currentPlayer to the player being iterated over right now
        let currentPlayer = playersObj[player];
        // Loop over each key in the currentPlayer
        Object.keys(currentPlayer).forEach(key => {
            // If the key is "territories",
            if (key == "territories") {
                // run a for loop over that territories array and...
                if (currentPlayer[key].length === 0) {
                    gameObj["winner"] = gameObj["playersTurn"];
                    return victory();
                }
            }
        })
    })
}

// Function to end game and show/celebrate winner
function victory() {
    alert (`${gameObj["playersTurn"]} has acheived victory!  All hail the Conqueror!`);
};

// ***********   Fortify helper functions   ***********

// Function to begin Fortifying
function beginFortify() {
    console.log("beginFortify function called");
};