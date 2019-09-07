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
        this.fullame = s + " " +v
    }
}

class Stack extends Array{
    constructor() {
        super();
    }
    drawCard() {
        return(this.shift);
    }
    /** @param {Card} card Card to add to the top of the stack */
    addToTop(card) {
        this.unshift( card );
    }
    shuffle() {
        var tDeck = new Stack();
        while(this.length) {
            var aCard = this.splice(drawRando(0,this.length - 1),1)[0];
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
        this.hand.push( s.drawCard() );
    }
    /**
     * @param {Number} i Index for discarding card
     * @param {*} s Stack to discard to
     */
    discardToStack(i, s) {
        s.addToTop( this.hand.splice(i,1) );
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
    }   
    //these are relative to their position on an array
    getNextLeft() {
        f--;
        if (f == -1) {
            f = this.players.length - 1;
        }
    }
    getNextRight() {
        f++;
        if (f == this.players.length) {
            f = 0;
        }
    }

    main() {

    }
}

// Input.question("WHATS YOUR FACTORIVE APPLE", function(str) {
//     console.log(str);
//     Input.close();
// })

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

Input.get("WHATS YOUR FAVORITE NUMBER?", function(nStr){
    console.log(nStr);
});
console.log("TEXT");

