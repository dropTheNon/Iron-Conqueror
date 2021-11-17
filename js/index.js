// Object to store new players in as they're created
const playersObj = {};
// Object to store info about this particular game in
const gameObj = {};

class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.troopsToDeploy = 0;
        this.territories = [];
        this.playerIsAttacker = null;
        this.playerIsTurn = null;
    }

    // Called at beginning of turn, to determine how many troops to deploy
    beginDeploy() {
        // Call helper function, set player's troopsToDeploy
        this.troopsToDeploy = deployHowMany(playersObj[this.name]);
        this.deploy(this.troopsToDeploy, this.territories);
    }

    // Deploy method, to deploy troops to their territories
    deploy(totalTroops, territories) {
        while (totalTroops > 0) {
            let troops = 0;
            let terr = null;
            // DOM Manipulation to deploy troops

            // receive input from player of how many of totalTroops to deploy on this territory
            // troops = // num from player input, <= totalTroops

            // receive input from player of which territory to deploy to
            // terr // = getElementById for territory to deploy on 

            // Making sure player has selected a # of troops and a territory to deploy to before making "Deploy" button work
            if (troops > 0 && terr != null) {
                // DOM manipulation to turn "Deploy" button active instead of inactive/throwing alert
                // getElementById deploy-button => active, btn-success, .onClick to actually deply the troops
            };
            // Use terr and indexOf to find index of this territory in player's array
            // let t = territories.indexOf(terr);
            // Add troops to territory's army
            // t.army += troops;

            // Call 
            // Decrement totalTroops to proceed through "while" loop
            // totalTroops -= troops;
        }
        beginAttack(playersObj[this.name]);
    }

    // Attack method, where "att" is the attacking territory and "def" is the defending territory
    attack(att, def) {

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
    }

    /* Method to advance troops to a conquered territory, 
    accepting same params as Attack, "att" and "def" */
    advanceTroops(att, def) {

    }
}

function startGame() {

}

// Function to create a new player object and store it in playersObj
function createPlayer(name, color) {
    playersObj[name] = new Player(name, color);

    // Alert "${name} created"
    // Clear values of name and color
    // getElementById name.value = "";
    // getElementById color.value = "";

    // DOM Manipulation to change Create Player modal to "Create Another Player" or "Start Game"
}

// Function to begin a new game
function beginNewGame() {
    // DOM manipulation to pop up modal with inputs for Player One name & color

    // Get input-values from form for player name and color
    // let name = // getElementById for name-input value
    // let color = // getElementById for color-input value

    // Call createPlayer function and pass in these values
    // createPlayer(name, color);
}

// SetTimeout function to pop up a small "Begin Game" modal a second or two after site is opened
// perhaps with some info about this being based off the board game Risk

// Testing

playersObj["Michel"] = new Player("Michel", "blue");

playersObj["Michel"].territories.push("m1", "m2", "m3");

console.log(playersObj["Michel"]);
beginAttack(playersObj["Michel"]);