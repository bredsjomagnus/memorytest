(function () {
    let websocket;
    let connect     = document.getElementById("connect");
    let nickname    = document.getElementById('nickname');
    let clientlist  = document.getElementById("clientarea");
    let output      = document.getElementById("msgarea");
    let sendmessage = document.getElementById("messagebtn");
    let startgame   = document.getElementById("startgame");
    let nextturnbtn = document.getElementById("nextturnbtn");
    let clientmessage = document.getElementById("message");
    let close       = document.getElementById("disconnectbtn");
    var player;

    player = {
        nickname: 'anon',
        colorclass: 'blackplayer'
    };

    /**
    * Check nickname inputfield. If empty disable connectionbtn.
    */
    function doCheck() {
        var nicknamevalue;

        if (nicknamevalue === '') {
            document.getElementById("connect").disabled = true;
        } else {
            document.getElementById("connect").disabled = false;
        }
    }

    // Checking nickname inputfield when keyup or when focusout
    $('#nickname').keyup(doCheck).focusout(doCheck);

    function renderClientArea(jsonmsg) {
        var HTMLlist = "";
        var yourturn = "";

        if (jsonmsg.playersturn == undefined) {
            yourturn = "";
        }

        clientlist.innerHTML = "";
        for (var i = 0; i < jsonmsg.userarray.length; i++) {
            if (jsonmsg.userarray[i] === jsonmsg.playersturn) {
                yourturn = "- din tur";
            } else {
                yourturn = "";
            }
            if (jsonmsg.userarray[i] === player.nickname) {
                HTMLlist += "<p class="+jsonmsg.userscolors[i]+
                "><strong>"+jsonmsg.userarray[i]+"</strong> "+yourturn+"</p>";
            } else {
                HTMLlist += "<p class="+jsonmsg.userscolors[i]+">"+jsonmsg.userarray[i]+" "+yourturn+"</p>";
            }
        }
        clientlist.innerHTML = HTMLlist;
    }

    function renderGameBoard(gameboard) {
        var gameboardhtml;
        var gameboardrow;
        var card;
        var cardholder;

        document.getElementById("gameboard").innerHTML = "";
        gameboardhtml = document.createElement("table");
        gameboardhtml.setAttribute("class", "gameboardtable");

        for (let y = 0; y < gameboard.height; y++) {
            gameboardrow = document.createElement("tr");
            for (let x = 0; x < gameboard.width; x++) {
                cardholder = document.createElement("td");
                card = document.createElement("button");
                card.setAttribute("id", "place_"+x+"_"+y);
                card.setAttribute("class", "cardholder");
                if (gameboard.position.indexOf(x+""+y) == -1) {
                    card.innerHTML = "<img class='cardimage' src='/images/memorycards/cardbackside.png' />";
                } else {
                    // gameboard.cardvalue[gameboard.position.indexOf(x+""+y)] = kortvärdet alltså bilden
                    //
                    if (gameboard.pairvalues.indexOf(gameboard.cardvalue[gameboard.position.indexOf(x+""+y)]) != 1) {
                        card.setAttribute("class", "cardholder "+gameboard.paircolors[gameboard.pairvalues.indexOf(gameboard.cardvalue[gameboard.position.indexOf(x+""+y)])]);
                    }

                    card.innerHTML = "<img class='cardimage' src='/images/memorycards/"+gameboard.cardvalue[gameboard.position.indexOf(x+""+y)]+"' />";
                }
                if (gameboard.activeplayer == player.nickname) {
                    card.onclick = function() {
                        var msg;

                        msg = {
                            type: "clickingcard",
                            player: player.nickname,
                            colorclass: player.colorclass,
                            x: x,
                            y: y
                        };
                        websocket.send(JSON.stringify(msg));
                    };
                }
                cardholder.appendChild(card);
                gameboardrow.appendChild(cardholder);
            }
            gameboardhtml.appendChild(gameboardrow);
        }
        document.getElementById("gameboard").appendChild(gameboardhtml);
    }

    function addClientMsg(jsonmsg) {
        let now = new Date();
        let timestamp = now.toLocaleTimeString();
        var htmlmsg;
        var nick = jsonmsg.nick;
        var content = jsonmsg.content;
        var chatwindow = document.getElementById('chatwindow');

        htmlmsg = document.createElement('div');
        htmlmsg.className = "well clientmsgwell";
        htmlmsg.innerHTML = "<p>"+`${timestamp}`+" [<strong>"+nick+"</strong>]:<br>"+content+"</p>";
        chatwindow.appendChild(htmlmsg);
        chatwindow.scrollTop = chatwindow.scrollHeight;
        // output.appendChild(htmlmsg);
    }

    function setPlayerparams(jsonmsg) {
        console.log("Setting uniquenickname to " + jsonmsg.uniquenick);
        player.nickname = jsonmsg.uniquenick;
        player.colorclass = jsonmsg.colorclass;
    }

    /**
    * What to do when user clicks Connect
    */
    connect.addEventListener("click", function() {
        console.log("Connecting to ws://localhost:8001/.");
        websocket = new WebSocket('ws://localhost:8001/');
        // console.log("Connecting to ws://82.102.5.98:8001/.");
        // websocket = new WebSocket('ws://82.102.5.98:8001/');
        websocket.onopen = function() {
            console.log("The websocket is now open.");
            var msg;

            msg = {
                type: 'newuser',
                content: nickname.value
            };
            websocket.send(JSON.stringify(msg));
            $("#connectform").hide();
            $("#messageform").show();
            $("#startgame").show();
            document.getElementById('gameboard').innerHTML = '';
            $("#gameboard").show();
        };

        websocket.onmessage = function(event) {
            console.log("Receiving message: " + event.data);
            var jsonmsg;

            jsonmsg = JSON.parse(event.data);

            if (jsonmsg.type === 'users') {
                renderClientArea(jsonmsg);
            } else if (jsonmsg.type === 'uniquename') {
                setPlayerparams(jsonmsg);
            } else if (jsonmsg.type === 'clientmsg') {
                addClientMsg(jsonmsg);
            } else if (jsonmsg.type === 'startgame') {
                $("#startgame").hide();
                // generate gameboard on clientside.
                renderGameBoard(jsonmsg.gameboard);
                renderClientArea(jsonmsg);
            } else if (jsonmsg.type === 'turnbackstageone') {
                // när två olika kort lyfts
                // jsonmsg.gameboard är inte resettat i detta läge.
                renderGameBoard(jsonmsg.gameboard);
            } else if (jsonmsg.type === 'nextturnbtn') {
                $("#nextturnbtn").show();
            }
        };

        websocket.onclose = function() {
            console.log("The websocket is now closed.");
            // console.log(websocket);
            $("#messageform").hide();
            $("#startgame").hide();
            $("#gameboard").hide();
            $("#connectform").show();
        };
    }, false);

    /**
     * What to do when user clicks to send a message.
     */
    sendmessage.addEventListener("click", function(/*event*/) {
        let messagetext = clientmessage.value;
        var msg;

        if (!websocket || websocket.readyState === 3) {
            console.log("The websocket is not connected to a server.");
        } else {
            msg = {
                type: "clientmsg",
                nick: player.nickname,
                content: messagetext
            };
            websocket.send(JSON.stringify(msg));
            console.log("Sending message: " + messagetext);
            clientmessage.value = "";
        }
    });

    /**
     * What to do when starting a game and setting the table
     */
    startgame.addEventListener("click", function(/*event*/) {
        var msg;

        if (!websocket || websocket.readyState === 3) {
            console.log("The websocket is not connected to a server.");
        } else {
            msg = {
                type: "startgame"
            };
            websocket.send(JSON.stringify(msg));
            console.log("Starting up a new game");
            $("#startgame").hide();
        }
    });

    nextturnbtn.addEventListener("click", function(/*event*/) {
        var msg;

        if (!websocket || websocket.readyState === 3) {
            console.log("The websocket is not connected to a server.");
        } else {
            msg = {
                type: "flip"
            };
            websocket.send(JSON.stringify(msg));
            console.log("reset gameboard");
            $("#nextturnbtn").hide();
        }
    });



    /**
     * What to do when user clicks Close connection.
     */
    close.addEventListener("click", function(/*event*/) {
        console.log("Closing websocket for %s.", player.nickname);
        var msg;

        msg = {
            type: 'deleteuser',
            content: player.nickname
        };
        websocket.send(JSON.stringify(msg));
        clientlist.innerHTML = "";
        output.innerHTML = "";
        websocket.close();
    });
})();
