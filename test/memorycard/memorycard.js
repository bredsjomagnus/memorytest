/**
* Test for class memorycard.
 */
"use strict";

/* global describe it */

var assert = require("assert");
const Memorycard = require("../../lib/Memory/memorycard");


/**
 * Check a card with its expected card face.
 */
function checkMemorycardvalue(id, expected) {
    let memorycard = new Memorycard();
    let res = memorycard.getCardValue(id);

    assert.equal(res, expected);
}

/**
* Check if two cards is a pair
*/
function isPair(cardone, cardtwo, expected) {
    let memorycard = new Memorycard();
    let res = memorycard.isPair(cardone, cardtwo);

    assert.equal(res, expected);
}

// function checkCardId(value, expected) {
//     let memorycard = new Memorycard();
//     let res = memorycard.getCardId(value);
//
//     assert.equal(res[0], expected[0]);
//     assert.equal(res[1], expected[1]);
// }

function checkResetedPosition() {
    let memorycard = new Memorycard();
    let res = memorycard.cardvalues;

    memorycard.placeCards(false);
    assert.deepEqual(res, [
        "alpaca.png", "alpaca.png",
        "giraff.png", "giraff.png",
        "monkeys.png", "monkeys.png",
        "panda.png", "panda.png",
        "puppy.png", "puppy.png",
        "ram.png", "ram.png",
        "wolf.png", "wolf.png",
        "squirrel.png", "squirrel.png",
        "fox.png", "fox.png",
        "bear.png", "bear.png"]);
}

function checkShuffledPosition() {
    let memorycard = new Memorycard();
    let res = memorycard.cardpositions;

    memorycard.placeCards();
    assert.notDeepEqual(res, [
        "alpaca.png", "alpaca.png",
        "giraff.png", "giraff.png",
        "monkeys.png", "monkeys.png",
        "panda.png", "panda.png",
        "puppy.png", "puppy.png",
        "ram.png", "ram.png",
        "wolf.png", "wolf.png",
        "squirrel.png", "squirrel.png",
        "fox.png", "fox.png",
        "bear.png", "bear.png"]);
}

/**
 * Testsuite
 */
describe("Check memorycard", function() {
    var values = [
        {position: "00", value: "alpaca.png"},
        {position: "01", value: "monkeys.png"},
        {position: "11", value: "monkeys.png"},
        {position: "12", value: "puppy.png"},
        {position: "22", value: "ram.png"},
        {position: "32", value: "ram.png"},
    ];
    var pairs = [
        {cardone: "00", cardtwo: "10", expected: true},
        {cardone: "01", cardtwo: "22", expected: false},
        {cardone: "02", cardtwo: "12", expected: true},
        {cardone: "30", cardtwo: "31", expected: false},
    ];
    // var cardids = [
    //     {value: 0, expected: [-1, -1]},
    //     {value: 300, expected: [-1, -1]},
    //     {value: 1, expected: [0, 1]},
    //     {value: 2, expected: [2, 3]},
    //     {value: 3, expected: [4, 5]}
    // ];

    values.forEach(function(test) {
        describe("Get memorycard value with position " + test.position, function() {
            it("should be value " + test.value, function () {
                checkMemorycardvalue(test.position, test.value);
            });
        });
    });

    pairs.forEach(function(pair) {
        describe("Memorycard with position " + pair.cardone + " and " + pair.cardtwo, function() {
            it("should be a pair = " + pair.expected, function() {
                isPair(pair.cardone, pair.cardtwo, pair.expected);
            });
        });
    });

    // cardids.forEach(function(cardid) {
    //     describe("Memorycard with value " + cardid.value, function() {
    //         it("should be have id pair = " + cardid.expected, function() {
    //             checkCardId(cardid.value, cardid.expected);
    //         });
    //     });
    // });

    describe("Unshuffled cardpositions", function() {
        it("should be default setting", function() {
            checkResetedPosition();
        });
    });

    describe("Shuffled cardpositions", function() {
        it("should not be default setting", function() {
            checkShuffledPosition();
        });
    });
});
