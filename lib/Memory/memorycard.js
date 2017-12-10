/**
 * A module for a standard playing card.
 *
 * @module
 */
"use strict";

class Memorycard {
    /**
     * @constructor
     */
    constructor() {
        this.cards = new Map([
            ["00", "alpaca.png"], ["10", "alpaca.png"],
            ["20", "giraff.png"], ["30", "giraff.png"],
            ["01", "monkeys.png"], ["11", "monkeys.png"],
            ["21", "panda.png"], ["31", "panda.png"],
            ["02", "puppy.png"], ["12", "puppy.png"],
            ["22", "ram.png"], ["32", "ram.png"],
            ["03", "wolf.png"], ["13", "wolf.png"],
            ["23", "squirrel.png"], ["33", "squirrel.png"],
            ["04", "fox.png"], ["14", "fox.png"],
            ["24", "bear.png"], ["34", "bear.png"],
        ]);
        this.cardvalues = [
            "alpaca.png", "alpaca.png",
            "giraff.png", "giraff.png",
            "monkeys.png", "monkeys.png",
            "panda.png", "panda.png",
            "puppy.png", "puppy.png",
            "ram.png", "ram.png",
            "wolf.png", "wolf.png",
            "squirrel.png", "squirrel.png",
            "fox.png", "fox.png",
            "bear.png", "bear.png"
        ];
        this.positions = [
            "00", "10", "20", "30",
            "01", "11", "21", "31",
            "02", "12", "22", "32",
            "03", "13", "23", "33",
            "04", "14", "24", "34"
        ];
        // this.cardvalue              = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
        // this.defaultcardpositions   = [
        //     "00", "10", "20", "30",
        //     "01", "11", "21", "31",
        //     "02", "12", "22", "32"
        // ];
        // this.cardpositions  = this.defaultcardpositions;
        this.numOfCards     = 20;
    }

    /**
     * Get value of memorycard based on its position.
     *
     * @param {string} position - The positin of the memorycard.
     *
     * @returns {string} value of memorycard.
     */
    getCardValue(position) {
        var value = this.cards.get(position);

        // console.log("Inne i getCardValue");
        // console.log(position);
        return value;
    }

    /**
    * Get positions of cards with certain value
    *
    * @param {string} cardvalue
    *
    */
    getPairPositions(pairvalue) {
        var pairpositions = [];

        this.cards.forEach(function(cardvalue, position, cards) {
            console.log(cards);
            if (cardvalue == pairvalue) {
                pairpositions.push(position);
            }
        });
        return pairpositions;
    }

    /**
     * Get id of memorycard based on value.
     *
     * @param {integer} id - The id of the card.
     *
     * @returns {array} possible id:s of card with value in format [id, id]
     */
    // getCardId(value) {
    //     if (value < 1 || value >= this.cardvalue[this.numOfCards - 1]) {
    //         return [-1, -1];
    //     }
    //
    //     var result = [];
    //     var pos = this.cardvalue.indexOf(value);
    //
    //     // walking cardvalue and adding posiiton to result[] where correct value
    //     while (result.indexOf(pos) === -1) {
    //         result.push(pos);
    //         pos = this.cardvalue.indexOf(value, pos + 1);
    //     }
    //
    //     // result contains positions and -1. Splice to take away -1.
    //     result.splice(2, 1);
    //
    //     return result;
    // }

    /**
     * Is two memorycards a pair.
     *
     * @param {integer} id - The id of the card.
     *
     * @returns {booelan} true if pair, false if not.
     */
    isPair(posone, postwo) {
        // if (cardone < 0 || cardone >= this.numOfCards) {
        //     return undefined;
        // }
        // if (cardtwo < 0 || cardtwo >= this.numOfCards) {
        //     return undefined;
        // }

        return this.cards.get(posone) == this.cards.get(postwo);
    }

    /**
    * Place memorycards = set this.cardpositions.
    */
    placeCards(random = true) {
        if (random) {
            this.shuffle();
        }

        for (let i = 0; i < this.positions.length; i++) {
            this.cards.set(this.positions[i], this.cardvalues[i]);
        }
    }

    shuffle() {
        var n = this.numOfCards,
            temp,
            i;

        // While there remain elements to shuffle…
        while (n) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * n--);

            // And swap it with the current element.
            temp = this.cardvalues[n];
            this.cardvalues[n] = this.cardvalues[i];
            this.cardvalues[i] = temp;
        }
    }

    getCardValues() {
        return [...this.cards.values()];
    }
}

// Export module
module.exports = Memorycard;
