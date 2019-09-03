var myIPv4 = sessionStorage.getItem("myIPv4");
var myKii = sessionStorage.getItem("kii");
// var gCode = sessionStorage.getItem("gameCode"); if youre on this page, its a given than the code is s/con4
var myName = sessionStorage.getItem("u");

var gameKii = "";
//red is 0 and yellow is 1 
playerColor = Math.round(Math.random());
botColor = !playerColor;
canMakeMove = false;
//because literall 0 computing is happening on client i can get away with this laziness
tokensPerColumn = [0,0,0,0,0,0,0]; 
//on second thought, this this the only mechanism that prevents the user from placing into a full column so now im kinda scared
//im spinning it as a feature where if the user decides to break the webpage and edit the array
//the user will lose a turn (which is the bug here lol)

function repair() {
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var gameBoard = document.getElementById("gameBoard");

    document.body.style.minWidth = window.innerWidth + "px";
    document.body.style.maxHeight = window.innerHeight + "px";
    //operation 1 is to get it into a 7x6 grid maybe?
    // if (screenW < screenH) {

    // }

    //op2 is to name all the columns by class, then give each column 6 image children
    //also build all the clicking ufunctinos here because i already work on columns here
    for (var n in gameBoard.children) {
        if (gameBoard.children[n].nodeName == "DIV") {
            gameBoard.children[n].className = ("boardColumn");
            gameBoard.children[n].columnNumber = n;
            //i get the feeling that i shouldnt make this anonymous
            //need feedback for this
            gameBoard.children[n].addEventListener("click", function() {
                if (canMakeMove && tokensPerColumn[this.columnNumber] < 6 ) {
                    var nReq = new XMLHttpRequest();
                    //yo i have no clue how this is still equal to the gameboard element but it works
                    //might have something to do with not cleaning up variables mentioned later (?)
                    //idk might be misinformed
                    var nURL = "http://" + myIPv4 + ":6689/updateCon4?manager=soloGame&kii=" + myKii + "&gKii=" + gameKii + "&col=" + this.columnNumber;
                    // dropToken(playerColor, this.columnNumber);
                    nReq.open("POST",nURL,true);
                    nReq.onreadystatechange = function() {
                        if (nReq.readyState == 4) {
                            //return type should be String[7]
                            var n = JSON.parse(nReq.responseText);
                            console.log(n);

                            //pull some relevant data
                            playerColumn = parseInt(n.pState[0].charAt(1));
                            pPostTurnStatus = n.pState[8].substring(2);
                            botColumn = 9;
                            bPostTurnStatus = 9;
                            if (n.bState.length > 8) {
                                botColumn = parseInt(n.bState[0].charAt(1));
                                bPostTurnStatus = n.bState[8].substring(2);
                            }

                            canMakeMove = false;

                            tryClear(pPostTurnStatus);
                            dropToken(playerColor, playerColumn, function() {
                                setTimeout(function() {
                                    hasEnded = tryEndGame("P",pPostTurnStatus);
                                    if (!hasEnded && n.bState.length > 8) {
                                        tryClear(bPostTurnStatus);
                                        
                                        dropToken(botColor, botColumn, function() {
                                            console.log("DROPPED BOT TOKEN");
                                            hasEnded = tryEndGame(bPostTurnStatus);
                                            if (!hasEnded) {
                                                canMakeMove = true;
                                            }
                                        })
                                    }
                                }, (Math.random() * 2) + .5);
                            });
                        }
                    }

                    nReq.send();
                }
            });
            for (var q = 0; q!= 6; q++) {
                
                var nImg = document.createElement("img");
                nImg.src = "con4Tile.png";
                gameBoard.children[n].appendChild(nImg);
                
            }
        }
    }
}

function init() {
    //define a few constants since we already locked the width

    //minimum distance for a token to be
    tokMinX = parseFloat(gameBoard.getBoundingClientRect().x);
    //the minimum x interval for a token to be on; also the exact size for a token image
    tokSize = parseFloat(document.getElementsByClassName("boardColumn")[0].getBoundingClientRect().width);

    //height freom the top, but im actually going to pull it up one token size because this will serve as the starting
    //point for the token images hmhmhmh!
    tokStartH = parseFloat(document.getElementsByClassName("boardColumn")[0].getBoundingClientRect().top) - tokSize;

    var nReq = new XMLHttpRequest();
    var nURL = "http://" + myIPv4 + ":6689/createNewInstance?manager=soloGame&gID=s/con4&kii=" + myKii;
    nReq.open("POST",nURL,true);
    nReq.onreadystatechange = function() {
        if (nReq.readyState == 4) {
            gameKii = JSON.parse(nReq.responseText).gKii;
            sessionStorage.setItem("gKii",gameKii);
            canMakeMove = true;
        }
    }
    nReq.send();
}

//color takkes an int 0 or 1 OR f or t; column is from 0 to 6 incluisve
function dropToken(color, column, callBack ) {

    var nImg = document.createElement("img");
    if (color) {
        nImg.src = "redPiece.png";
    } else {
        nImg.src = "yellowPiece.png";
    }
    
    nImg.className = "token";

    var someDeg = parseInt(Math.random() * 360);
    nImg.style.webkitTransform = "rotate(" + someDeg + "deg)"
    

    var xLoc = tokMinX + (tokSize * column);
    nImg.style.left = xLoc + "px";

    var yTarget = tokStartH + (6 - tokensPerColumn[column]) * tokSize;
    tokensPerColumn[column]++;

    document.body.appendChild(nImg);
    constMoveHTML(nImg, "top", tokStartH, yTarget, 2800, callBack);
    
}

function tryClear(code) {
    if (code == "CLR") {
        while (document.body.children.length != 4) {
            document.body.removeChild(document.body.children[4]);
        }
    }
}

function tryEndGame(user, code) {
    if (code == "WIN") {
        canMakeMove = false;
        if (user = "B") {
            user = "COMPUTER";
        } else {
            user = "HUMAN";
        }
        
        alert("END GAME, " + user + " HAS WON");
        return(true);
    }
    return false
}

