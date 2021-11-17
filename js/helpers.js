// ***********   Helper functions   ***********

// ***********   Begin Game helper functions   ***********

// Function to check if playerObj is not empty before starting game
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
};

// Function to randomly distribute territories to players in playersObj,
// receiving the playersObj as a parameter
function mapDrop(playersObj) {
    // Initialize playerArray to push player's names into
    let playerArray = [];
    // Initialize a copy of our territories array to splice 
    let tempTerritories = [...territories];
    Object.keys(playersObj).forEach(key => {
        if (key === "name") {
            playerArray.push(playersObj[key]);
        }
    });
    
}

// ***********   Deploy helper functions   ***********

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
function deployHowMany(player) {
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
    return troops;
}

// ***********   Attack helper functions   ***********

// Function to change terrCanAttack based off whether there are neighbors able to be attacked
// accepts as params 1) array of objects (terr) that can attack, 
// and 2) array of arrays that are neighbors able to be attacked
function filterOutAttacking(attackObj) {
    let tempTCA = attackObj.terrCanAttack;
    let tempFAT = attackObj.attackableTerrs;
    for (let i = 0; i < tempFAT.length; i++) {
        if (tempFAT[i].length === 0) {
            tempTCA.splice(i, 1);
            tempFAT.splice(i, 1);
            i -= 1;
        }
    }
    attackObj.terrCanAttack = tempTCA;
    attackObj.attackableTerrs = tempFAT;
    console.log(attackObj);
    return attackObj;
}

// Function to filter out territories player owns from territories that can be attacked
// accepts params of array of arrays, playername
function filterOutAlreadyOwned(attackObj) {
    // For loop to get into each sub-array
    let allAttackableTerrs = attackObj.attackableTerrs;
    let playerName = attackObj.name;
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
    attackObj.attackableTerrs = allAttackableTerrs;
    // return our attackObj
    return filterOutAttacking(attackObj);
}

// Function to list array of arrays, where the secondary arrays are the territoriesthat are able to be attacked
// and param is attackObj
function attackableTerritoriesCheck(attackObj) {
    let attackableTerrs = [];
    attackObj.terrCanAttack.forEach((attackingTerr) => {
        territories.filter((territory) => {
            if (attackingTerr.name === territory.name) {
                attackableTerrs.push(territory.neighbors);
            };
        });
    });
    attackObj["attackableTerrs"] = attackableTerrs;
    return filterOutAlreadyOwned(attackObj);
}

// Function to find territories that can attack (where this.player is owner, and army > 1)
// param is attackObj object
function findTerrCanAttack(attackObj) {
    // Initialize empty array to hold this players territories that have more than 1 army (and so can attack)
    let terrCanAttack = [];
    
    // Loop over all territories - if this player is owner and it has army greater than 1,
    territories.forEach((terr) => {
        if (terr.owner === attackObj.name && terr.army > 1) {
            // push this into our attack-able array
            terrCanAttack.push(terr)
        }
    });
    // Sort array so it's more visually appealing 
    terrCanAttack.sort();
    attackObj["terrCanAttack"] = terrCanAttack;
    console.log(attackObj);
    return attackableTerritoriesCheck(attackObj);
}

// Function to begin attacking phase & change Action Box, where param is playersObj.[name-of-player]
function beginAttack(player) {
    let attackObj = {
        "name" : player.name   
    }
    // Call first helper function using our attackObj
    findTerrCanAttack(attackObj);

    console.log("final attackObj", attackObj);

    /* DOM manipulation to change Action Box to attacking phase, 
    with drop down selection of territories from terrCanAttack */

    // Once player selects a territory to attack from
    // let attacker = // players input selection for territory to attack from
    // Find index of this territory in our array of attacking territories,
    // let attackerIndex = terrCanAttack.indexOf(attacker);
    // So that we can find the corresponding array by index in our array of attackables
    // let attackables = allAttackableTerrs[attackerIndex];
    // 
}

// Function to determine # of dice for attacker and defender & obtain their dice
function diceRoll(att, def) {

    // Number of dice each player will get
    let numAttDice, numDefDice;
    // Result object, a sorted array of dice rolls for each player
    let result = {
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
        result["attacker-dice"].push(Math.floor(Math.random() * 6 + 1))
    }
    for (var i = 1; i <= numDefDice; i++) {
        result["defender-dice"].push(Math.floor(Math.random() * 6 + 1))
    }

    // Sorting and reversing dice-rolls arrays for comparison
    result["attacker-dice"].sort().reverse();
    result["defender-dice"].sort().reverse();

    console.log(result);
    return result;
}

// Function to remove a specific element from an array, for removing conquered territories from defender
function arrayRemove(arr, value) {
    return arr.filter(function(elem) {
        return elem != value;
    });
}

// ***********   Fortify helper functions   ***********