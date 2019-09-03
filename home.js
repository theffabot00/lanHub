
var myIPv4 = sessionStorage.getItem("myIPv4");
var myName = sessionStorage.getItem("u");
var myKii = sessionStorage.getItem("kii");

function Choose(someNum) {
    //0 for freeplay, 1 for room making, 2 for single, 3 for stats
    if (someNum == 2) {
        document.location.href = "singlePlayer.html";
    }
}

function shine(someHTML) {
    if (!someHTML.isShining) {
        someHTML.isShining = true;

        var counter = 0;

        someHTML.tim = setInterval(function() {
            console.log("SHINING AT " + counter);
            someHTML.setAttribute("style","background-image: linear-gradient(120deg, rgba(0,0,0,0) " + (0 + counter * 5) + "%, rgba(255,255,255,.8) " + (10 + counter * 5) + "%, rgba(255,255,255,.8) " + (15 + counter * 5)+ "%, rgba(0,0,0,0) " + (25 + counter * 5) + "%);");
            counter++;
            if (counter == 21) {
                clearInterval(someHTML.tim);
                someHTML.isShining = false;
            }
        },16);
    }
}
// class buttonShine {
//     constructor(someHTMLEl) {

//     }
// }
