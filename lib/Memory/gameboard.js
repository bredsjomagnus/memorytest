/**
 * A module for player.
 *
 * @module
 */
"use strict";

class Gameboard {
    /**
     * @constructor
     *
     * @param {int} width - number of cards horizontaly.
     * @param {int} height - number of cards verticaly.
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.numOfCards = width*height;
        this.position = []; // of cards that has flipped
        this.cardvalue = []; // of cards that has flipped
        this.activeplayer; // nickname of player who´s turn it is
        this.gotpair;
        this.pairpositions = [];
        this.pairvalues = [];
        this.paircolors = [];
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    setGotPair(gotpair) {
        this.gotpair = gotpair;
    }

    addPosition(position) {
        this.position.push(position);
    }

    addCardValue(cardvalue) {
        this.cardvalue.push(cardvalue);
    }

    addPairPositions(pairpos) {
        this.pairpositions.push.apply(this.pairpositions, pairpos);
        // console.log("GAMEBOARD: addPairPositions: " + this.pairpositions);
    }

    addPairValues(cardvalue) {
        this.pairvalues.push(cardvalue);
        this.pairvalues.push(cardvalue);
    }

    addPairColors(colorclass) {
        this.paircolors.push(colorclass);
        this.paircolors.push(colorclass);
    }

    /**
    * Flips all cards back
    */
    resetCards() {
        var pairpositions = this.pairpositions;
        var pairvalues = this.pairvalues;

        this.position = [];
        this.position.push.apply(this.position, pairpositions);
        this.cardvalue = [];
        this.cardvalue.push.apply(this.cardvalue, pairvalues);
        // console.log("GAMEBOARD: resetCards - this.position: " + this.position);
        // console.log("GAMEBOARD: resetCards - this.pairpositions: " + this.pairpositions);
        // console.log("GAMEBOARD: resetCards - this.cardvalue: " + this.cardvalue);
        // console.log("GAMEBOARD: resetCards - this.pairpositions: " + this.pairpositions);
    }

    setActivePlayer(player) {
        this.activeplayer = player;
    }
}

// Export module
module.exports = Gameboard;
