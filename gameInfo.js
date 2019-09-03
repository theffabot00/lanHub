
myIPv4 = sessionStorage.getItem("myIPv4");
myKii = sessionStorage.getItem("kii");
myName = sessionStorage.getItem("u");
thisGameID = sessionStorage.getItem("gameCode");


function repair() {
    infoSections = document.getElementById("lowerHalf");
    var topSpace = 240 //this is an estimate on my pc; also tired of writing a million getcomputedstyles 
    infoSections.style.maxHeight = (parseInt(window.innerHeight) - topSpace ) + "px";
}

function init() {
    var nReq = new XMLHttpRequest();
    var nURL = "http://" + myIPv4 + ":6689/getGameDesc?manager=gameInfo&gID=" + thisGameID + "&kii=" + myKii;
    nReq.open("POST",nURL,true);
    nReq.onreadystatechange = function() {
        if (this.readyState == 4) {
            var res = this.responseText;
            document.getElementById("ruleSet").innerHTML = res.substring(1, res.length - 1);
        }
    }
    nReq.send();
}

function play() {
    var nReq = new XMLHttpRequest();
    var nURL = "http://" + myIPv4 + ":6689/getGameScreen?manager=soloGame&kii=" + myKii + "&gID=" + thisGameID;
    nReq.open("POST",nURL,true);
    nReq.onreadystatechange = function() {
        if (this.readyState == 4) {
            var n = JSON.parse(this.responseText).s;
            console.log(n);
            document.location.href= n;
        }
    }
    nReq.send();
}
