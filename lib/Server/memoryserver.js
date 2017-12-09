const Memory = require('memorytest');

let gameboard = new Memory.Gameboard();
let gamebrain = new Memory.Gamebrain();
let memorycard = new Memory.Memorycard();

wss.adduser = (nickname, ws) => {
    usersobject.push({
        name: nickname,
        websocket: ws
    });
}

wss.dropuser = (ws) => {
    var deletenick;
    var founduser = false;

    usersobject.forEach((userobj) => {
        if (userobj.websocket === ws) {
            founduser = true;
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

// Broadcast data to everyone.
wss.broadcastUsers = (data) => {
    let clients = 0;
    wss.clients.forEach((client) => {
        clients++;
        client.send(data);
    });
};

// Get back to only ws client
wss.answerBackWith = (data, ws) => {
    ws.send(data);
};

// Setup for websocket requests.
// Docs: https://github.com/websockets/ws/blob/master/doc/ws.md
wss.on("connection", (ws, data) => {
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
            gameboard = new Gameboard(4, 5);
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
                playerinturn = false;
                gameboard.setActivePlayer(playerinturn);
                type = 'turnbackstageone';
                nextbtnmsg = {
                    type: 'nextturnbtn'
                }
                wss.answerBackWith(JSON.stringify(nextbtnmsg), ws);
            } else {
                gotpair = gamebrain.gotPair();
                gameboard.setGotPair(gotpair);
                playerinturn = gamebrain.setActivePlayer();
                gameboard.setActivePlayer(playerinturn);

                if (gotpair != "") {
                    console.log("ÄR HÄR INNE OCH INGEN ANNANSTANS: " + gotpair);
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
