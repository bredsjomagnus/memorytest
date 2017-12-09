/**
* Test for class gamebrain.
 */
"use strict";

/* global describe it */

var assert = require("assert");
const Gamebrain = require("../../src/Memory/gamebrain");


/**
 * Check if card is set correctly
 */
function checkSetCardValue(player, colorclass, cardvalue, expectedcardvalues) {
    let gamebrain = new Gamebrain();
    let res;

    gamebrain.setCardValue(player, colorclass, cardvalue);
    res = gamebrain.cardvalues;
    assert.deepEqual(res, expectedcardvalues);

    gamebrain.setCardValue(player, colorclass, cardvalue);
    res = gamebrain.paircheck;
    assert.equal(res, colorclass);

    res = gamebrain.numberofplayermoves;
    assert.equal(res, 0);
}

/**
* Check if nickname is uniqified correctly
*/
function checkUniqifining(nickone, nicktwo, nickthree, expected) {
    let gamebrain = new Gamebrain();
    let res;

    gamebrain.addPlayer(nickone, "blackplayer");
    if (nickthree != "") {
        gamebrain.addPlayer(nickthree, "blueplayer");
    }

    res = gamebrain.uniquifyname(nicktwo);

    assert.equal(res, expected);
}

/**
* Check setting of active player
*/
function checkSetActivePlayer(players) {
    let gamebrain = new Gamebrain();
    let firstplayer;
    let res;

    for (let i = 0; i < players.length; i++) {
        gamebrain.addPlayer(players[i], "blackplayer");
    }

    firstplayer = gamebrain.setActivePlayer(true);
    gamebrain.numberofplayermoves = 0;
    res = gamebrain.setActivePlayer();

    assert.equal(res, firstplayer);


    gamebrain.numberofplayermoves = 2;
    res = gamebrain.setActivePlayer();

    assert.notEqual(res, firstplayer);
}

/**
* Check setting of player color
*/
function checkSetPlayerColor(players) {
    let gamebrain = new Gamebrain();
    let colors = [];
    var sortedcolors;
    var res = [];

    for (let i = 0; i < players.length; i++) {
        colors.push(gamebrain.setPlayerColor(players[i]));
    }

    sortedcolors = colors.slice().sort();

    for (var i = 0; i < sortedcolors.length - 1; i++) {
        if (sortedcolors[i + 1] == sortedcolors[i]) {
            res.push(sortedcolors[i]);
        }
    }

    assert.equal(res.length, 0);
}

/**
 * Testsuite
 */
describe("Check gamebrain", function() {
    var cardvalues = [
        {player: "Magnus", colorclass: "blueplayer", cardvalue: "alpaca.png", expectedcardvalues: ["alpaca.png"]},
    ];

    var uniqifynames = [
        {nicknameone: "Magnus", nicknametwo: "Magnus", nicknamethree: "", expected: "Magnus2"},
        {nicknameone: "Magnus", nicknametwo: "Magnus", nicknamethree: "Magnus2", expected: "Magnus3"},
        {nicknameone: "Magnus", nicknametwo: "Roger", nicknamethree: "", expected: "Roger"}
    ];

    var setactive = [
        {players: ["a", "b", "c"]}
    ];

    var setcolor = [
        {players: ["a", "b", "c"]}
    ];

    // var cardids = [
    //     {value: 0, expected: [-1, -1]},
    //     {value: 300, expected: [-1, -1]},
    //     {value: 1, expected: [0, 1]},
    //     {value: 2, expected: [2, 3]},
    //     {value: 3, expected: [4, 5]}
    // ];

    cardvalues.forEach(function(test) {
        describe("Set card values in gamebrain", function() {
            it("Checking values", function () {
                checkSetCardValue(test.player, test.colorclass, test.cardvalue, test.expectedcardvalues);
            });
        });
    });

    uniqifynames.forEach(function(test) {
        describe("Check uniqifying names " + test.nicknameone +" with " + test.nicknametwo, function() {
            it("Second nickname should be " + test.expected, function () {
                checkUniqifining(test.nicknameone, test.nicknametwo, test.nicknamethree, test.expected);
            });
        });
    });

    setactive.forEach(function(test) {
        describe("Check set active player", function() {
            it("Checking next player", function () {
                checkSetActivePlayer(test.players);
            });
        });
    });

    setcolor.forEach(function(test) {
        describe("Check set color for player", function() {
            it("Checking color", function () {
                checkSetPlayerColor(test.players);
            });
        });
    });
});
