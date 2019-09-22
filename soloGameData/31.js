/*
 * rotten luck or really busted computer?
 * this is going to be the sixth time i write this game
 * i think i have the rules and algorithms memorized
 * buggy computer + not uploading to github = bad
 * 
 * from iteration five, i said i would make everything or most things objects
 * so back ot that
 * 
*/ 

var readline = require("readline");
// var Input = readline.createInterface({
//     input:process.stdin,
//     output:process.stdout
// });

var moreMath = require("./moreMath");

class Card {
    /** @param {String} s Takes values "DIA", "CLB", "HRT", "SPD" */
    /** @param {Number} v Takes values btween 1 and 13 */
    constructor(s, v) {
        this.suit = s;
        this.val = v;
        this.fullName = s + " " +v;
    }
    toString() {
        return (this.suit +  " " + this.val);
    }
}

class Stack extends Array{
    /**
     * 
     * @param {String} n Optional name of stack
     */
    constructor(n) {
        super();
        this.fullName = n;
    }
    drawCard() {
        return(this.shift());
    }
    /** @param {Card} card Card to add to the top of the stack */
    addToTop(card) {
        this.unshift( card );
    }
    shuffle() {
        var tDeck = new Stack();
        while(this.length) {
            var aCard = this.splice(moreMath.randInt(0,this.length - 1),1)[0];
            tDeck.push(aCard);
        }
        this.push.apply(this,tDeck);
    }
    getSum() {
        //ive done this so many times; writing it isnt particularly fun
        var cardsByVal = [];
        cardsByVal.length = 14;
        cardsByVal.fill(0);

        var cardsBySuit = {"DIA":0,"CLB":0,"HRT":0,"SPD":0};

        for(var c in this) {
            cardsByVal[this[c].val]++;
            cardsBySuit[this[c].suit] += this[c].val;
        }
        var max = Math.max.apply(Math, cardsByVal);
        if (max > 2) {
            return(30); 
        } else {
            return(Math.max(cardsBySuit.DIA, cardsBySuit.CLB, cardsBySuit.HRT, cardsBySuit.SPD));
        }

    }
    toString() {
        var nStr = `The ${this.fullName} consists of `;
        for (var card in this) {
            nStr += this[card].fullName + ", ";
        }
        return(nStr);
    }
}

class Player {
    /**
     * @param {Number} seat Required. Seat number in the Game 
     * @param {Boolean} iBot Required. Tells if the player is a bot
     * @param {Function} botFunc Required if the player is a bot. Function should make decisions for the bot and return data.
     * @param {Stack} s Optional. Start the player with a given hand
     */
    constructor(seat, iBot, botFunc, s) {
        this.seat = seat;
        this.isBot = iBot;
        if (this.isBot) { 
            this.botFunc = botFunc;
        }
        if (s) {
            this.hand =  s;
        } else {
            this.hand = new Stack();
        }
        this.strikes = 0;
    }
    /** @param {Stack} s Stack to draw from */
    drawFromStack(s) {
        var someCard = s.drawCard();

        this.hand.push( someCard );
        console.log("Seat " + this.seat + " drew from " + s.fullName + ", drawing a " + someCard.toString());
    }
    /**
     * @param {Number} i Index for discarding card
     * @param {Stack} s Stack to discard to
     */
    discardToStack(i, s) {
        var someCard = this.hand.splice(i,1)[0];
        console.log("Seat " + this.seat + " discarded a " + someCard.toString());
        s.addToTop( someCard );
    }
    toString() {
        var nStr = `Seat ${this.seat} currently has, from left to right, `;
        for (var card in this.hand) {
            if (typeof this.hand[card] == "object")
                nStr += this.hand[card].fullName + ", ";
        }
        return(nStr);
    }
    /**
     * 
     * @param {Stack} ds discard stack
     * @param {Stack} dw drawing stack
     */
    //yo wtf is happening here lol
    static randomAct(ds, dw) {
        this.drawFromStack(arguments[moreMath.randInt(0,1)]);
        this.discardToStack(moreMath.randInt(0,3), ds);
    }
}

class GameEnvironment {
    /**
     * 
     * @param {Array.<Player>} players Array of players
     * @param {Number} f Focus 
     */
    constructor(players, f) {
        this.players = players;
        this.focus = f;

        this.winner = -1;
    }   
    //these are relative to their position on an array
    getNextLeft() {
        this.focus--;
        if (this.focus == -1) {
            this.focus = this.players.length - 1;
        }
    }
    getNextRight() {
        this.focus++;
        if (this.focus == this.players.length) {
            this.focus = 0;
        }
    }

    //THE MAIN METHOD (is buried in here)
    //it executes the game, but do note that 
    //THIS IS NOT "MAIN" MAIN
    //THERE ARE CHUNKS OF INITIALIZING CODE AT THE BOTTOM
    async main() {
        var facedownDeck = new Stack("face down pile");
        var discardPile = new Stack("discard pile");
        const SUITS = ["DIA","CLB","HRT","SPD"];
        for (var s in SUITS) {
            for (var v = 1; v != 14; v++) {
                facedownDeck.addToTop( new Card(SUITS[s], v) );
            }
        }
        facedownDeck.shuffle();
        discardPile.addToTop( facedownDeck.drawCard() ); //make sure that its legal to draw from disco at any time
        var knocked = 1;
        for (var plyr in this.players) {
            for (var n = 0 ;n != 3; n++) {
                this.players[plyr].drawFromStack(facedownDeck);
            }
        }
        while (this.winner == -1) {
            this.getNextRight();
            if (this.players[this.focus].isBot) {
                this.players[this.focus].botFunc(discardPile, facedownDeck);
            } else {
                console.log(this.players[this.focus].toString());
                var drawPromise = new Promise(function(resolve, reject) {
                    Input.get("Draw from facedown deck or discard pile? (F/D)", function(choice) {
                        resolve(choice);
                    });
                });
                var drawFrom = await drawPromise;
                switch(drawFrom) {
                    case("F"):
                        this.players[this.focus].drawFromStack(facedownDeck);
                        break;
                    case("D"):
                        this.players[this.focus].drawFromStack(discardPile);
                        break;        
                }
                console.log(this.players[this.focus].toString());
                var discardPromise = new Promise(function(resolve,reject){
                    Input.get("Which card do you discard? (0/1/2/3)", function(choice) {
                        resolve(parseInt(choice));
                    });
                });
                var discoIndex = await discardPromise;
                this.players[this.focus].discardToStack(discoIndex, discardPile);

            }
        }

    }

    playerHandler() {

    }
}

// var readline = require("readline");
// var nInterface = readline.createInterface({
//     input: process.stdin,
//     output:process.stdout
// });
// nInterface.question("whats your favorite color?", function(nStr) {
//     console.log(nStr);
// });
// console.log("ITS ASYNC");

//is this really necessary? does this waste memory? the answers are likely no and yes
class Input {
    //this is news to me
    /**
     * 
     * @param {String} question Question to ask in console
     */

    static get(question, cb) {
        var nInterface = readline.createInterface({
            input: process.stdin,
            output:process.stdout
        })
        nInterface.question(question, function(nStr) {
            cb(nStr);
            nInterface.close();
        });
    }
}



// Input.get("WHATS YOUR FAVORITE NUMBER?", function(nStr){
//     console.log(nStr);
// });
// console.log("TEXT");




var playerList = [
    new Player(0, false), 
    new Player(1, true, Player.randomAct), 
    new Player(2, true, Player.randomAct), 
    new Player(3, true, Player.randomAct)
];

var dealer = moreMath.randInt(0,3);
console.log("DEALRR " + dealer);

var gameSession = new GameEnvironment(playerList, dealer);
gameSession.main();

// Input.get("whats your favorite color?", function(nStr) {
//     console.log("this was suppoed to happen before");
// });

// console.log("after the inpuit get");