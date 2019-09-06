var myIPv4 = sessionStorage.getItem("myIPv4");
var myKii = sessionStorage.getItem("kii");
// var gCode = sessionStorage.getItem("gameCode"); if youre on this page, its a given than the code is s/con4
var myName = sessionStorage.getItem("u");

var gameKii = "";
//red is 0 and yellow is 1 
playerColor = Math.round(Math.random());
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

    document.body.style.minWidth = "100vw";
    document.body.style.maxWidth = "100vw";
    //operation 1 is to get it into a 7x6 grid maybe?
    // if (screenW < screenH) {

    // }

    //op2 is to name all the columns by class, then give each column 6 image children

    for (var n in gameBoard.children) {
        if (gameBoard.children[n].nodeName == "DIV") {
            gameBoard.children[n].className = ("boardColumn");
            gameBoard.children[n].columnNumber = n;
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
                            console.log(n)
                            tokensPerColumn[this.columnNumber] ++;
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

//color takkes an int 0 or 1; column is from 0 to 6 incluisve
function dropToken(color, column ) {

    var nImg = document.createElement("img");
    if (color == 0) {
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
    constMoveHTML(nImg, "top", tokStartH, yTarget, 2800, function(){

        console.log("dropped");
    } );
    
}

