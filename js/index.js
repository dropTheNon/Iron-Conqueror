// Object to store new players in as they're created
const playersObj = {};
// Object to store info about this particular game in
const gameObj = {
    "status" : "active",
    "numberOfTurns": 1
};
// Available colors
let playerColors = ["Red", "Orange", "Yellow", "Green", "Blue", "Pink"];

class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.troopsToDeploy = 0;
        this.territories = [];
    }

    // ***********   Player methods   ***********

    // Called at beginning of turn to populate deploy form
    beginDeploy() {

        // Change displayMessage
        let displayMessage = document.getElementById("display-message");
        displayMessage.innerHTML = "Deploy your troops";

        // Hide "Begin Turn" button
        let beginTurnButton = document.getElementById("begin-turn-btn");
        beginTurnButton.style.display = "none";

        // DOM manipulation to show deployTroops form
        let deployForm = document.getElementById("deploy-form");
        deployForm.style.display = "flex";

        // Calling helper functions to create options in select boxes for deploying troops
        availableTerritories();
        availableTroops();

        // if this player is out of troops, call beginAttack() function
        if (this.troopsToDeploy === 0) {
            return beginAttack();
        }
    }

    // Deploy method, to deploy troops to their territories
    deploy(territoryToDeployOn, troopsToDeployOntoIt) {
        // Loop over territories array
        territories.forEach(terr => {
            // to find territory player is deploying onto
            if (terr.name === territoryToDeployOn) {
                // increment the territory's army #, using unary operator to turn string into number
                terr.army += +(troopsToDeployOntoIt);
                // decrement the troopsToDeploy by this #
                this.troopsToDeploy -= troopsToDeployOntoIt;
            };
        });
        mapUpdate();
        // call beginDeploy() method again so player can deploy all their troops
        return this.beginDeploy();
    }

    // Attack method, where "att" is the attacking territory and "def" is the defending territory
    attack(terrToAttackFrom, terrToBeAttacked) {

        let att, def;

        territories.forEach(terr => {
            if (terr.name === terrToAttackFrom) {
                att = terr;
            };
            if (terr.name === terrToBeAttacked) {
                def = terr
            }
        });

        console.log("att", att);
        console.log("def", def);

        // passing in our result object from our dice-roll function to get dice for att and def
        let result = diceRoll(att, def);
        
        let attDice = result["attacker-dice"];
        let defDice = result["defender-dice"];

        // Compare results
        while (defDice.length > 0) {
            /* If attacker's first dice is higher, and checking to
            see if territory has been conquered, to break loop */
            if (att.owner !== def.owner && attDice[0] > defDice[0]) {
                // defender loses 1 army
                def.army -= 1;
                // if defender has no army
                if (def.army === 0) {
                    // Reset defenders dice to 0 to break while loop
                    defDice = [];
                    // attacker loses 1 army to hold their new territory
                    att.army -= 1;
                    def.army = 1;
                    // add territory to attacker's territories and remove from defender's
                    att.territories.push(def.name);
                    let defender = def.owner
                    defender.territories = arrayRemove(defender.territories, def.name);
                    // change owner of "def" to attacker, change color
                    def.owner = att.owner;
                    def.color = att.color;

                    // Call method advanceTroops
                    // this.advanceTroops(att, def);
                    break;
                }
            }
            // If dice are tied, or defender dice is higher
            if (defDice.length !== 0 && attDice[0] <= defDice[0]) {
                // attacker loses 1 army
                att.army -= 1;
                // if attacker is down to just 1 army and can't attack
                if (att.army === 1) {
                    // Reset defenders dice to 0 to break while loop
                    defDice = [];
                }
            }

            // Reduce dice to proceed with while loop
            if (defDice.length > 0) {
                // Remove highest (left-most) dice from each players' dice array
                result["attacker-dice"].shift();
                result["defender-dice"].shift();
            }
        }
        // Call winCheck function to see if victory has been achieved!
        // winCheck(playersObj);
    }

    /* Method to advance troops to a conquered territory, 
    accepting same params as Attack, "att" and "def" */
    advanceTroops(att, def) {

    }
}

// ***********   Other important functions   ***********

function beginTurn() {
    // Use our turnIndex and number of players
    let turnIndex = gameObj["turnIndex"];
    let numberOfPlayers = gameObj["numberOfPlayers"];
    // to find the index of whose turn it is now
    let currentTurnIndex = turnIndex % numberOfPlayers;
    // and setting that player as playersTurn in gameObj
    gameObj["playersTurn"] = gameObj["players"][currentTurnIndex];
    // Display message about which players' turn it is
    let player = playersObj[gameObj["playersTurn"]];
    let displayMessage = document.getElementById("display-message");
    // For first turn, display this:
    if (gameObj["numberOfTurns"] === 1) {
        displayMessage.innerHTML = `Game has begun - it is ${player.name}'s turn!`;
    } else {
        displayMessage.innerHTML = `It is ${player.name}'s turn`;
    }
    // Show "Begin Turn" button
    let startGameButton = document.getElementById("start-game-btn");
    startGameButton.style.display = "none";
    // make visible create-player-form
    let beginTurnButton = document.getElementById("begin-turn-btn");
    beginTurnButton.style.display = "flex";
}

// Function to start a new game
function startGame() {
    
    // Create array of our players
    let players = Object.keys(playersObj);

    // Add info to our gameObj
    // players = array of our players
    gameObj["players"] = players;
    gameObj["numberOfPlayers"] = players.length;
    // Randomly assign one player to go first, by finding turnIndex
    let playerTurnIndex = randomizer(players);
    gameObj["turnIndex"] = playerTurnIndex;
    // Call our first helper function to assign territories
    mapDrop();

    // Call beginTurn function to change the player's turn
    beginTurn();
}

// Function to create a new player object and store it in playersObj
// name and color are obtained from inputs from player
function createPlayer() {
    let name = document.getElementById("new-player-name").value;
    let color = document.getElementById("new-player-color").value;
    // Create new player, added to our playersObj
    playersObj[name] = new Player(name, color);

    // Removing chosen color from playerColor array
    let capitalColor = color.charAt(0).toUpperCase();
    capitalColor += color.slice(1);
    playerColors = arrayRemove(playerColors, capitalColor);
    // Repopulate our available colors
    availableColors();

    // Change display message
    let displayMessage = document.getElementById("display-message");
    displayMessage.innerHTML = `${name} created!  Create another player to play against`
    // Clear value of name
    document.getElementById("new-player-name").value = "";

    // DOM Manipulation to change Create Player modal to "Create Another Player" or "Start Game"
    if (Object.keys(playersObj).length === 2){
        let newPlayerForm = document.getElementById("create-player-form");
        newPlayerForm.style.display = "none";
        displayMessage.innerHTML = "Players created! Click 'Start Game' to begin playing!";
        let startGameButton = document.getElementById("start-game-btn");
        startGameButton.style.display = "block";
    }
}

// Function to begin a new game
function beginNewGame() {
    // DOM manipulation to:
    // add select options to color selector
    availableColors();
    // change the text of display-message
    let displayMessage = document.getElementById("display-message");
    displayMessage.innerHTML = "Create Player";
    // hide the Play button, and... 
    let playGameButton = document.getElementById("play-btn");
    playGameButton.style.display = "none";
    // make visible create-player-form
    let createPlayerForm = document.getElementById("create-player-form");
    createPlayerForm.style.display = "flex";
}

// SetTimeout function to pop up a small "Begin Game" modal a second or two after site is opened
// perhaps with some info about this being based off the board game Risk


// ***********   Event Listeners   ***********

// Event listener for form submission for attacking territories
document.getElementById("attack-form").addEventListener("submit", function(event) {
    // Prevent form submission from refreshing page (and ruining game!)
    event.preventDefault();

    // Grab our information being submitted by the player
    let terrToAttackFrom = document.getElementById("deploy-to-territory").value;
    let terrToBeAttacked = document.getElementById("deploy-how-many").value;

    // Call our deploy(method) with these values as parameters
    let player = playersObj[gameObj["playersTurn"]];
    player.attack(terrToAttackFrom, terrToBeAttacked);
});

// Event listener for form submission for deploying troops
document.getElementById("deploy-form").addEventListener("submit", function(event) {
    // Prevent form submission from refreshing page (and ruining game!)
    event.preventDefault();

    // Grab our information being submitted by the player
    let terrToDeployOnto = document.getElementById("deploy-to-territory").value;
    let troopsToDeployOnto = document.getElementById("deploy-how-many").value;

    // Call our deploy(method) with these values as parameters
    let player = playersObj[gameObj["playersTurn"]];
    player.deploy(terrToDeployOnto, troopsToDeployOnto);
});

// Event listener for "Begin Turn" button
document.getElementById("begin-turn-btn").addEventListener("click", function() {

    // Call deployHowMany helper function
    deployHowMany();
});