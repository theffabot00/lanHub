
var myIPv4 = sessionStorage.getItem("myIPv4");
var myName = sessionStorage.getItem("u");
var myKii = sessionStorage.getItem("kii");

//this is going to come in via json later
var dataBundles = [];
var selectables = new Flow();


function repair() {
    lBanner = document.getElementById("largeBanner");
    farTop = document.getElementById("farTop");
    selWrap = document.getElementById("selectWrap");
    sel = document.getElementById("select");
    gameName = document.getElementById("gameName");

    var totalHeight = window.innerHeight;
    var totalWidth = window.innerWidth;
    var remainingHeight = totalHeight - parseInt(window.getComputedStyle(lBanner).getPropertyValue("height")) - parseInt(window.getComputedStyle(farTop).getPropertyValue("height")) - parseInt(window.getComputedStyle(gameName).getPropertyValue("height"));
    
    selWrap.style.height = (remainingHeight - 48) + "px";

    //this part is for making squares and stuff
    ICONS = sel.children;
    if (totalWidth < totalHeight) {
        for (var i = 1; i != 4; i++) {
            ICONS[i].style.height = window.getComputedStyle(ICONS[i]).getPropertyValue("width");
        }
    } else {
        for (var i = 1; i != 4; i++) {
            ICONS[i].style.width = window.getComputedStyle(ICONS[i]).getPropertyValue("height");
        }
    }

}

function init() {
    //this is the big import
    var nReq = new XMLHttpRequest();
    var nURL = "http://" + myIPv4 + ":6689/getNames?manager=soloGame&kii=" + myKii;
    nReq.open("POST",nURL, true);
    nReq.onreadystatechange = function() {
        if (this.readyState == 4) {

            //gameData is jsut a chunky js object containing something that looks like (an index): {gameName:"", gameIconPath:"", gameID:""}
            var someDat = JSON.parse(nReq.responseText);
            for (var ob in someDat) {
                dataBundles.push(someDat[ob]);
                selectables.push(parseInt(ob));
            }
            ICONS[2].inx = 0;
            gameName.innerHTML = dataBundles[0].gameName;
            updateSlide();

        }
    }
    nReq.send();

}

function updateSlide() {
    ICONS[2].style.backgroundImage = "url(" + dataBundles[ICONS[2].inx].gameIconPath + ")";
    ICONS[1].style.backgroundImage = "url(" + dataBundles[selectables.getNextLeft(ICONS[2].inx)].gameIconPath + ")";
    ICONS[3].style.backgroundImage = "url(" + dataBundles[selectables.getNextRight(ICONS[2].inx)].gameIconPath +")";
}

function move(someInt) {
    if (someInt < 0) {
        ICONS[2].inx = selectables.getNextLeft(ICONS[2].inx);
    } else {
        ICONS[2].inx = selectables.getNextRight(ICONS[2].inx);
    }
    gameName.innerHTML = dataBundles[ICONS[2].inx].gameName;
    updateSlide();
}

function moveToInfo(someNumber) {
    sessionStorage.setItem("gameCode",dataBundles[someNumber].gameID);
    document.location.href = "gameInfo.html";
}