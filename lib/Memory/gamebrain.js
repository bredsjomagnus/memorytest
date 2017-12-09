/**
 * A module for Memory game brain.
 *
 * @module
 */
"use strict";

class Gamebrain {
    /**
     * @constructor
     */
    constructor() {
        this.colors = [
            "blackplayer",
            "redplayer",
            "blueplayer",
            "greenplayer",
            "pinkplayer",
            "orangeplayer",
            "yellowplayer",
            "limegreenplayer",
            "purpleplayer"
        ];
        this.usedcolors = [];
        this.players = new Map();
        this.playersscore = new Map(); // filles with players and cardvalues of pairs
        this.paircheck = ""; // temp holder for checking if pair fliped.
        this.playerinturnmarker = 0; // for moving forward to next player in turn.
        this.playerinturn; // nickname of player in turn.
        this.numberofplayermoves = 0; // number of moves player in turn has done.
        this.cardvalues = []; // for storing flipped cards values.
    }

    /**
    * Adding player to Map (nickname, colorclass)
    *
    * @param {string} player - uniqified nickname
    * @param {string} color - color class for that player
    */
    addPlayer(player, color) {
        this.players.set(player, color);
    }

    makeMove() {
        this.numberofplayermoves += 1;
        console.log("this.numberofplayermoves: " + this.numberofplayermoves);
    }

    setCardValue(player, colorclass, cardvalue) {
        // finns det inget kort här så lägga bara till
        // finns det redan ett kort kolla om det har samma värde.
        // har det samma värde är det ett par och numberofplayermoves nollställs
        // man tar även bort alla kort i cardvalues
        // är det inte ett par nollställs inte inte numberofplayers men cardvalues töms.
        var cardvalues = this.cardvalues;

        if (cardvalues.length === 0) {
            this.cardvalues.push(cardvalue);
        } else {
            // det finns kort i cardvalues
            if (cardvalues.indexOf(cardvalue) != -1) {
                // det är samma värde som nyinkomna.
                this.numberofplayermoves = 0;
                // lägger till spelares colorclass med kort i poänglistan.
                this.playersscore.set(player, cardvalue);
                this.paircheck = colorclass;
            }
            this.cardvalues = [];
        }
    }

    /**
    * Set and get player in turn.
    *
    * @param {boolean} firstround - set to false by default.
    *
    * @return {string} nickname of player who´s turn it is.
    */
    setActivePlayer(firstround = false) {
        var players = this.getPlayersNicks();
        var numberofplayermoves = this.numberofplayermoves;

        // console.log("numberofplayermoves: " + numberofplayermoves);
        if (firstround) {
            this.playerinturnmarker = Math.floor(Math.random() * players.length);
            this.playerinturn = players[this.playerinturnmarker];
            this.numberofplayermoves = 0;
            // console.log("firstround - this.playerinturnmarker: " + this.playerinturnmarker);
            // console.log("firstround - this playerinturn: " + this.playerinturn);
        } else {
            if (numberofplayermoves == 2) {
                // console.log("Selecting new active player.");
                var playerinturnmarker = this.playerinturnmarker;

                if (playerinturnmarker < players.length-1) {
                    this.playerinturnmarker += 1;
                } else {
                    this.playerinturnmarker = 0;
                }
                // console.log("this.playerinturnmarker: " + this.playerinturnmarker);
                this.playerinturn = players[this.playerinturnmarker];
                // console.log("New player in turn: " + this.playerinturn);
                this.numberofplayermoves = 0;
            }
        }
        return this.playerinturn;
    }

    dropPlayer(player) {
        this.players.delete(player);
        // console.log("Players (accroding to GameBrain)");
        // console.log(this.players);
    }

    /**
    * Decide unique color for 'player' and add player to player Map
    *
    * @param {string} player - nickname of player to add to game
    *
    * @return {string} colorclass for player
    */
    setPlayerColor(player) {
        var color = "blackplayer";
        var notuniquecolor = true;

        while (notuniquecolor) {
            color = this.colors[Math.floor(Math.random() * this.colors.length)];
            if (this.usedcolors.indexOf(color) === -1) {
                notuniquecolor = false;
                this.usedcolors.push(color);
                this.addPlayer(player, color);
            }
        }
        return color;
    }

    /**
    * Takes a nickname and add a figure to make nickname unique.
    *
    * @param {string} incomingnickname, from new user.
    *
    * @return {string} unique nickname.
    */
    uniquifyname(incomingnickname) {
        var incomingnicknamelength = incomingnickname.length;
        var stringdiff;
        var users = this.getPlayersNicks();
        var counter = 2;

        // while(users.indexOf(incomingnickname) !== -1) {
        while (users.indexOf(incomingnickname) !== -1) {
            if (incomingnickname.length == incomingnicknamelength) {
                incomingnickname = incomingnickname + counter;
            } else {
                stringdiff = incomingnickname.length - incomingnicknamelength;
                incomingnickname = incomingnickname.slice(0, -stringdiff);
                incomingnickname = incomingnickname + counter;
            }
            counter++;
        }
        return incomingnickname;
    }

    getPlayersNicks() {
        return [...this.players.keys()];
    }

    getPlayersColors() {
        return [...this.players.values()];
    }

    /**
    * Used to check if pair was flipped
    *
    * @return {string} result - 'nopair' if no pair was flipped. Otherwise players colorclass.
    */
    gotPair() {
        var result = "";

        if (this.paircheck != "") {
            result = this.paircheck;
            this.paircheck = "";
        }
        return result;
    }
}

// Export module
module.exports = Gamebrain;
