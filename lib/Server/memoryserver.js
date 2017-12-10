const WebSocket = require("ws");
const Memory = require('memorytest');

var usersobject = [];
let gameboard;
let gamebrain = new Memory.Gamebrain();
let memorycard = new Memory.Memorycard();

const wss = new WebSocket.Server({
    server: server,
    clientTracking: true, // keep track on connected clients
});

wss.adduser = (nickname, ws) => {
    usersobject.push({
        name: nickname,
        isAlive: true,
        websocket: ws
    });
}

// When disconnecting controllably
wss.dropuser = (ws) => {
    var deletenick;
    var founduser = false;

    usersobject.forEach((userobj) => {
        if (userobj.websocket === ws) {
            founduser = true;
            console.log("Drop " + userobj.name);
            deletenick = userobj.name;
            gamebrain.dropPlayer(deletenick);
        }
    });

    if (founduser) {
        usersobject = usersobject.filter(function(usr) {
           return usr.websocket !== ws;
        });
    }
}

// When connection is broken
wss.dropdead = () => {
    var deletenick;
    var founduser = false;

    usersobject.forEach((userobj) => {
        if (!userobj.isAlive) {
            founduser = true;
            console.log("Drop " + userobj.name);
            deletenick = userobj.name;
            gamebrain.dropPlayer(deletenick);
        }
    });

    if (founduser) {
        usersobject = usersobject.filter(function(usr) {
           return usr.isAlive;
        });
        msg = {
            type: "users",
            userarray: gamebrain.getPlayersNicks(),
            userscolors: gamebrain.getPlayersColors()
        }
        wss.broadcastUsers(JSON.stringify(msg));
    }
}



// Broadcast data to everyone.
wss.broadcastUsers = (data) => {
    let clients = 0;
    wss.clients.forEach((client) => {
        clients++;
        client.send(data);
    });
    console.log(`Broadcasted users to ${clients} (${wss.clients.size}) clients.`);
};

wss.answerBackWith = (data, ws) => {
    ws.send(data);
};

const interval = setInterval(function ping() {
    if (usersobject.length != wss.clients.size) {
        usersobject.forEach(function(usr) {
            usr.isAlive = false;
        });
        wss.clients.forEach(function each(ws) {
            usersobject.forEach((userobj) => {
                if (userobj.websocket === ws) {
                    userobj.isAlive = true;
                }
            });
        });
        wss.dropdead();
    }
}, 5000);


// Setup for websocket requests.
// Docs: https://github.com/websockets/ws/blob/master/doc/ws.md
wss.on("connection", (ws, data) => {
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    console.log("Connection received. Adding client.");
    ws.on("message", (message) => {
        jsonmsg = JSON.parse(message);
        if (jsonmsg.type === 'newuser') {
            var uniquename = gamebrain.uniquifyname(jsonmsg.content);
            wss.adduser(uniquename, ws);
            playercolor = gamebrain.setPlayerColor(uniquename);
            uniquemsg = {
                type: "uniquename",
                uniquenick: uniquename,
                colorclass: playercolor
            }
            wss.answerBackWith(JSON.stringify(uniquemsg), ws);

            msg = {
                type: "users",
                userarray: gamebrain.getPlayersNicks(),
                userscolors: gamebrain.getPlayersColors()
            }
            wss.broadcastUsers(JSON.stringify(msg));
        } else if (jsonmsg.type === 'deleteuser') {
            wss.dropuser(ws);
        } else if (jsonmsg.type === 'clientmsg') {
            msg = {
                type: "clientmsg",
                nick: jsonmsg.nick,
                content: jsonmsg.content
            }
            wss.broadcastUsers(JSON.stringify(msg));
        } else if (jsonmsg.type === 'startgame') {
            var playerinturn;
            gameboard = new Memory.Gameboard(4, 5);
            memorycard.placeCards(); // shuffle and place cards on gameboard
            playerinturn = gamebrain.setActivePlayer(true); // true for first turn
            gameboard.setActivePlayer(playerinturn);
            msg = {
                type: "startgame",
                gameboard: gameboard,
                playersturn: playerinturn,
                userarray: gamebrain.getPlayersNicks(),
                userscolors: gamebrain.getPlayersColors()
            }
            wss.broadcastUsers(JSON.stringify(msg));
        } else if (jsonmsg.type === "clickingcard") {
            var position = jsonmsg.x+""+jsonmsg.y;
            var cardvalue = memorycard.getCardValue(position);
            var type = 'startgame';
            var gotpair;
            var pairpositions = [];

            gameboard.addPosition(position);
            gameboard.addCardValue(cardvalue);

            // tell gamebrain that move has been done.
            gamebrain.makeMove();
            // tell gamebrain to remember flipped card and notice eventual pairs
            gamebrain.setCardValue(jsonmsg.player, jsonmsg.colorclass, cardvalue);


            if (gamebrain.numberofplayermoves == 2) {
                // här har två olika kort vänts.
                // spelplanen resettas inte.
                // playerinturn sätt så att ingen kan vända kort
                playerinturn = false;
                gameboard.setActivePlayer(playerinturn);
                type = 'turnbackstageone';

                // msg tillbaka till användaren som gjort klart sitt drag.
                // så att denna får fram 'Nästa spelare' knappen
                nextbtnmsg = {
                    type: 'nextturnbtn'
                }
                wss.answerBackWith(JSON.stringify(nextbtnmsg), ws);
            } else {
                // Antingen bara ett kort lyft eller ett par lyft.
                // gotpair parametern i gameboard sätt till spelare eller nopair
                gotpair = gamebrain.gotPair();
                gameboard.setGotPair(gotpair);
                playerinturn = gamebrain.setActivePlayer();
                gameboard.setActivePlayer(playerinturn);

                if (gotpair != "") {
                    pairpositions = memorycard.getPairPositions(cardvalue);
                    gameboard.addPairPositions(pairpositions);
                    gameboard.addPairValues(cardvalue);
                    gameboard.addPairColors(jsonmsg.colorclass);
                }
            }

            msg = {
                type: type,
                gameboard: gameboard,
                playersturn: playerinturn,
                userarray: gamebrain.getPlayersNicks(),
                userscolors: gamebrain.getPlayersColors(),
            }
            wss.broadcastUsers(JSON.stringify(msg));
        } else if (jsonmsg.type === 'flip') {
            // Här har spelaren tryck på 'Nästa spelare'
            gameboard.resetCards();
            gameboard.setGotPair(gamebrain.gotPair());
            playerinturn = gamebrain.setActivePlayer();
            gameboard.setActivePlayer(playerinturn);
            msg = {
                type: 'startgame',
                gameboard: gameboard,
                playersturn: playerinturn,
                userarray: gamebrain.getPlayersNicks(),
                userscolors: gamebrain.getPlayersColors(),
            }
            wss.broadcastUsers(JSON.stringify(msg));
        }
    });

    ws.on("error", (error) => {
        console.log(`Server error: ${error}`);
    });

    ws.on("close", (code, reason) => {
        console.log(`Closing connection: ${code} ${reason}`);
        msg = {
            type: "users",
            userarray: gamebrain.getPlayersNicks(),
            userscolors: gamebrain.getPlayersColors()
        }
        wss.broadcastUsers(JSON.stringify(msg));
    });
});
