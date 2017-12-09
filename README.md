# Memory Game

## A module for educational purposes

This is a test module for **educational purposes** (PA1442 H17 Lp2 Webbaserade ramverk 2, [BTH](https://www.bth.se/)).

**Don't waste your space or time on this**

### Installation
`npm install memorytest`

Detta är blott och enbart klasserna för att sätta upp och spela memoryspelet på serversidan.

Den är beroende av modulen `ws`.

---

#### Övrig kod och bilder

**Serversidan (bin/www.js)**: /lib/Server/memoryserver.js eller <br>
**Klienten**: /lib/Client/memoryclient.js eller <br>
*Glöm inte sätta ws host:port i koden för klienten.*
```
connect.addEventListener("click", function() {
    websocket = new WebSocket('ws://host:port/');
```

**Bilder**: /lib/Images/Memorycards eller
**Style**: /lib/Style/memory.less eller
**HTML**: /lib/Pug/memory.pug<br>
*Bara ett skelett. Måste själv hämta hem rätt layout och lägga till memoryclient.js.*


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
