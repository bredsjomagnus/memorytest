**BUILD STATUS**

*Travis*: [![Build Status](https://travis-ci.org/bredsjomagnus/memorytest.svg?branch=master)](https://travis-ci.org/bredsjomagnus/memorytest), *Scrutinizer*: [![Build Status](https://scrutinizer-ci.com/g/bredsjomagnus/memorytest/badges/build.png?b=master)](https://scrutinizer-ci.com/g/bredsjomagnus/memorytest/build-status/master)


**CODE COVERAGE**

*Scrutinizer*: [![Code Coverage](https://scrutinizer-ci.com/g/bredsjomagnus/memorytest/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/bredsjomagnus/memorytest/?branch=master), *Coveralls*: [![Coverage Status](https://coveralls.io/repos/github/bredsjomagnus/memorytest/badge.svg?branch=master)](https://coveralls.io/github/bredsjomagnus/memorytest?branch=master), *Codecov*: [![codecov](https://codecov.io/gh/bredsjomagnus/memorytest/branch/master/graph/badge.svg)](https://codecov.io/gh/bredsjomagnus/memorytest)

<!-- *Codeclimate*: [![Test Coverage](https://api.codeclimate.com/v1/badges/fe43330227738fcde371/test_coverage)](https://codeclimate.com/github/bredsjomagnus/memorytest/test_coverage) -->

**CODE QUALITY**

*Scrutinizer*: [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/bredsjomagnus/memorytest/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/bredsjomagnus/memorytest/?branch=master), *Codeclimate*: [![Maintainability](https://api.codeclimate.com/v1/badges/fe43330227738fcde371/maintainability)](https://codeclimate.com/github/bredsjomagnus/memorytest/maintainability), *Codeacy*: [![Codacy Badge](https://api.codacy.com/project/badge/Grade/59e45be9ec944a0b8b08992f61086b85)](https://www.codacy.com/app/bredsjomagnus/memorytest?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bredsjomagnus/memorytest&amp;utm_campaign=Badge_Grade)
# Memory Game
![exempelbild](https://i.imgur.com/nUgH6fU.png)

## A module for educational purposes

This is a test module for **educational purposes** (PA1442 H17 Lp2 Webbaserade ramverk 2, [BTH](https://www.bth.se/)).

### Installation
`npm install memorytest`

Detta är blott och enbart klasserna för att sätta upp och spela memoryspelet på serversidan.

Den är beroende av modulen `ws`.

---

#### Kod och bilder som måste läggas till

**Serversidan**<br>
lib/Server/memoryserver.js eller [memoryserver.js](https://github.com/bredsjomagnus/memorytest/blob/master/lib/Server/memoryserver.js)<br>
*Läggs in i bin/www eller motsvarande.*


**Klienten**<br>
lib/Client/memoryclient.js eller [memoryclient.js](https://github.com/bredsjomagnus/memorytest/blob/master/lib/Client/memoryclient.js) <br>
*Glöm inte sätta ws host:port i koden i klienten.*
```
connect.addEventListener("click", function() {
    websocket = new WebSocket('ws://host:port/');
```

**Bilder**<br>
lib/Images/Memorycards eller [memorycards](https://github.com/bredsjomagnus/memorytest/tree/master/lib/Images/Memorycards) <br>
*Att lägga under public/images/memorycards/*<br>
*Nuvarnde bildnamn är "alpaca.png", "giraff.png", "monkeys.png", "panda.png", "puppy.png", "ram.png", "wolf.png", "squirrel.png", "fox.png", "bear.png".*<br>
*Vill man ha andra bilder ändras detta i lib/Memory/Memorycard.js och att det finns korresponderande bilder i public/images/memorycards/*

**Style**<br>
lib/Style/memory.less eller [memory.less](https://github.com/bredsjomagnus/memorytest/blob/master/lib/Style/memory.less) <br>
*Att lägga under public/stylesheet/*

**HTML**<br>
lib/Pug/memory.pug eller [memory.pug](https://github.com/bredsjomagnus/memorytest/blob/master/lib/Pug/memory.pug) <br>
*Bara ett skelett som bygger på bootstrap. Måste själv extend layout och lägga till scripts så som memoryclient.js.*


---
### Beskrivning av klasserna
#### Gameboard
Spelbrädet som skickas till spelarna för uppdatering av webbläsaren.

Spelbrädet kan idagsläget enbart skapas med storleken Gameboard(4, 5)

params:
- width - antalet rutor horisontellt
- height - antalet rutor vertikalt
- numOfCards
- position
- cardvalue
- activeplayer
- gotpair
- pairpositions
- pairvalues
- paircolors

Metoder:
- getWidth() returns int width
- getHeight() return int height
- setWidth(int width)
- setHeight(int height)
- setGotPair(gotpair)
- addPosition(position)
- addCardValue(cardvalue)
- addPairPositions(pairposition)
- addPairValues(cardvalue)
- addPairColors(colorclass)
- resetCards() flips all cards
- setActivePlayer(string player)

#### Gamebrain
Spelhjärnan som håller koll på regler, vilka spelarna är och vad som bör hända härnäst beroende på vad spelarna gör.

params:
- colors - *string* möjliga färger på spelarna. Begränsar antalet spelare.
    - "blackplayer",
    - "redplayer",
    - "blueplayer",
    - "greenplayer",
    - "pinkplayer",
    - "orangeplayer",
    - "yellowplayer",
    - "limegreenplayer",
    - "purpleplayer"
- usedcolors - *string* namnen på de färger som används
- players - *string* spelomgångens spelares namn
- playersscore
- paircheck
- playerinturnmarker - *int* markör för spelets turgång
- playerinturn *string* namnet på spelaren som är på tur
- numberofplayermoves - *int* antalet drag en spelare har gjort under sin tur
- cardvalues - vända kort

Metoder:

- addPlayer(*string* player, *string* color)
- makeMove()
- setCardValue(*string* player, *string* colorclass, *string* cardvalue) - metod för att avgöra om en spelares drag är slut eller inte efter att ha lyft ett kort.
- setActivePlayer(firstround = false) return *string* aktiv spelares namn. Metoden anropas med *true* för första spelrundan och då slumpas en spelare fram som får börja.
- dropPlayer(*string* player) - tar bort spelare från spelomgången.
- setPlayerColor(*string* player) - return *string* färg på spelaren. Sätter unik färg på *player*.
- uniquifyname(*string* incomingnickname) - return *string* unikt spelarnamn. Om någon redan har önskat nickname sätt en siffra bakom nya nicknamet med början på 2. Exemplevis doe och doe2.
- getPlayersNicks() - return *array* alla deltagande spelarnas namn
- getPlayersColors() - return *array* alla deltagande spelarnas färger
- gotPair() - return *string* nopair om det inte var ett par. Annars spelarens som lyfte parets färg.

#### Memorycard
Innehåller informationen om korten i spelet. Vad för bild som är på och vilken plats kortet ligger på på spelbärdet.

params:
- cards - *Map* [[*string* position, *string* cardvalue],... ]
- cardvalues - *array* med namnet på bilderna (*string*)
- positions - *array* med positionerna som (*string*)
- numOfCards - *int* antalet kort

Metoder:
- getCardValue(position) - return *string* kortvärde (bildnamn) på viss given position
- getPairPositions(pairvalue) - return *array* positionerna för kort med värdet *pairvalue*
- isPair(cardone, cardtwo) - return *boolean* true om korten är ett par. False annars.
- placeCards(random = true) - placerar korten på brädet. Om man anropar med *false* blandas inte korten innan.
- shuffle() - blandar korten.
- getCardValues() - return *array* med alla kortens värde (bildnamn)
