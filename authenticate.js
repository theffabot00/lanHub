
var myIPv4 = sessionStorage.getItem("myIPv4");
// var myName = sessionStorage.getItem("u");
// var myKii = sessionStorage.getItem("kii");

function authenticate() {
    var nReq = new XMLHttpRequest();
    var nURL = "http://" + myIPv4 + ":6689/auth?manager=login&u=" + sessionStorage.getItem("u") + "&kii=" + sessionStorage.getItem("kii");
    console.log(nURL);

    nReq.open("POST",nURL,true);
    nReq.onreadystatechange = function() {
        if (this.readyState == 4) {
            var n = JSON.parse(this.responseText);
            console.log(n);
            if (n.kii) {
                document.getElementById("namePlate").innerHTML = myName;
            } else {
                sessionStorage.removeItem("u");
                sessionStorage.removeItem("myKii");
                alert("suspicious activity, please log in");
                document.location.href="index.html";
            }
        }
    }
    nReq.send();

}
