// Object to store new players in as they're created
const playersObj = {};

// Object to store info about this particular game in
const gameObj = {
    "status" : "active",
    "numberOfTurns": 1
};

// Object to store attack information in
const attackObj = {};

// Object to store fortify info in
const fortifyObj = {};

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

            let displayMessage = document.getElementById("display-message");
            displayMessage.innerHTML = "Attack enemy territories";
        
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

    // Attack method, to attack a territory
    attack() {

        let att, def;
        let tempTerritories = [...territories];
        tempTerritories.forEach(function callback(terr, index) {
            if (terr.name === attackObj["att"]) {
                att = terr;
                attackObj["terrIndexOfAttacker"] = index;
            };
            if (terr.name === attackObj["def"]) {
                def = terr;
                attackObj["terrIndexOfDefender"] = index;
            }
        });

        // Call our dice-roll function to get dice for att and def territories
        diceRoll();
        
        // Variables for attacker dice, defender dice
        let attDice = attackObj["dice-roll-result"]["attacker-dice"];
        let defDice = attackObj["dice-roll-result"]["defender-dice"];

        // variables for att.owner, def.owner
        let attacker = att.owner;
        let defender = def.owner;

        // Compare results
        while (defDice.length > 0) {
            /* If attacker's first dice is higher, and checking to
            see if territory has been conquered, to break loop */
            if (attacker !== defender && attDice[0] > defDice[0]) {
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
                    playersObj[attacker].territories.push(def.name);
                    console.log("playersObj[defender].territories", playersObj[defender].territories);
                    playersObj[defender].territories = arrayRemove(playersObj[defender].territories, def.name);
                    // change owner of "def" to attacker, change color
                    def.owner = att.owner;
                    def.color = att.color;

                    mapUpdate();

                    // Call method beginAdvanceTroops()
                    return this.beginAdvanceTroops();
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
                mapUpdate();
            }

            // Reduce dice to proceed with while loop
            if (defDice.length > 0) {
                // Remove highest (left-most) dice from each players' dice array
                attackObj["dice-roll-result"]["attacker-dice"].shift();
                attackObj["dice-roll-result"]["defender-dice"].shift();
            }
        }

        // Call function to update map visuals
        mapUpdate();
        // Call winCheck function to see if victory has been achieved!
        winCheck();
        // If no victory yet, call beginAttack() again
        beginAttack();
    }

    // Method to advance troops
    advanceTroops(troopsToAdvance) {
        // Change territories' troop numbers based off how many troops player advanced
        territories[attackObj["terrIndexOfDefender"]].army += +(troopsToAdvance);
        territories[attackObj["terrIndexOfAttacker"]].army -= +(troopsToAdvance);
        // call mapUpdate to refresh map, and beginAttack to reset to attack mode
        mapUpdate();
        let displayMessage = document.getElementById("display-message");
        displayMessage.innerHTML = "Attack a territory";
        beginAttack();
    };

    // Method to begin to advance troops to a conquered territory, where params are territory objects
    // from our territories array
    beginAdvanceTroops() {

        // Map Update
        mapUpdate();

        // Change display message
        let displayMessage = document.getElementById("display-message");
        displayMessage.innerHTML = "Territory conquered! How many troops to advance?";

        // Hide attack-form
        let attackForm = document.getElementById("attack-form");
        attackForm.style.display = "none";

        // Show advance-form
        let advanceTroopsForm = document.getElementById("advance-form");
        advanceTroopsForm.style.display = "flex";

        // Call helper function to populate drop down box for advancing
        advanceHowMany();
    }

    // Method to fortify troops to adjacent territory
    fortify() {
        territories[fortifyObj["fortifyFromIndex"]].army -= +(fortifyObj["howManyTroops"]); 
        territories[fortifyObj["fortifyToIndex"]].army += +(fortifyObj["howManyTroops"]);
        
        let fortifyTroopsForm = document.getElementById("fortify-form");
        fortifyTroopsForm.style.display = "none";

        let endTurnButton = document.getElementById("end-turn-btn");
        endTurnButton.style.display = "none";

        mapUpdate();
        changeTurn();
    }
}

// ***********   Other important functions   ***********

function beginTurn() {
    // Use our turnIndex and number of players
    gameObj["round"] = Math.ceil(gameObj["numberOfTurns"] / 2);
    let turnIndex = gameObj["turnIndex"];
    let numberOfPlayers = gameObj["numberOfPlayers"];
    // to find the index of whose turn it is now
    let currentTurnIndex = turnIndex % numberOfPlayers;
    // and setting that player as playersTurn in gameObj
    gameObj["playersTurn"] = gameObj["players"][currentTurnIndex];
    // Display message about which players' turn it is
    let player = playersObj[gameObj["playersTurn"]];
    let roundStatusMessage = document.getElementById("round-status");
    roundStatusMessage.innerHTML = `Round ${gameObj["round"]} - ${gameObj["playersTurn"]}'s turn`;

    
    let displayMessage = document.getElementById("display-message");
    displayMessage.innerHTML = "Begin turn";
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
    gameObj["numberOfTurns"] = 1;

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
        let roundStatusMessage = document.getElementById("round-status");
        roundStatusMessage.innerHTML = "Start Round 1";
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
    let roundStatusMessage = document.getElementById("round-status");
    roundStatusMessage.innerHTML = "Create Players";
    let displayMessage = document.getElementById("display-message");
    displayMessage.innerHTML = "Create first player!";
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

// Event listener for "End Turn" button 
document.getElementById("end-turn-btn").addEventListener("click", function(event) {
    event.preventDefault();
    
    let fortifyTroopsForm = document.getElementById("fortify-form");
    fortifyTroopsForm.style.display = "none";

    let endTurnButton = document.getElementById("end-turn-btn");
    endTurnButton.style.display = "none";

    changeTurn();
});

// Event listener for "Fortify Troops" button
document.getElementById("fortify-form").addEventListener("submit", function(event) {
    // Prevent form submission from refreshing page (and ruining game!)
    event.preventDefault();

    // Grab how many troops our player is fortifying
    let troopsToFortify = document.getElementById("fortify-how-many").value;
    // and where they're fortifying to
    let terrToFortify = document.getElementById("fortify-to-territories").value;

    territories.forEach(function callback(terr, index) {
        if (terr.name === terrToFortify) {
            fortifyObj["fortifyToIndex"] = index;
        }
    });

    fortifyObj["howManyTroops"] = troopsToFortify;

    let player = playersObj[gameObj["playersTurn"]];
    player.fortify();
});

// Event listener for "Advance Troops" button
document.getElementById("advance-form").addEventListener("submit", function(event) {
    // Prevent form submission from refreshing page (and ruining game!)
    event.preventDefault();

    // Grab how many troops our player is advancing
    let troopsToAdvance = document.getElementById("advance-how-many").value;

    // Call our deploy(method) with these values as parameters
    let player = playersObj[gameObj["playersTurn"]];
    // pass this into our advance() method
    player.advanceTroops(troopsToAdvance);
});

// Event listener for "End Attacks" button
document.getElementById("end-attack-btn").addEventListener("click", function() {
    let endAttackButton = document.getElementById("end-attack-btn");
    endAttackButton.style.display = "none";
    // Call beginFortify() helper function
    beginFortify();
});

// Event listener for form submission for attacking territories
document.getElementById("attack-form").addEventListener("submit", function(event) {
    // Prevent form submission from refreshing page (and ruining game!)
    event.preventDefault();

    // Grab our information being submitted by the player and add to attackObj
    let terrToAttackFrom = attackObj["att"];
    let terrToBeAttacked = document.getElementById("attack-these-territories").value;
    attackObj["def"] = terrToBeAttacked;

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