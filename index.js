
var myIPv4 = "192.168.1.6";
sessionStorage.setItem("myIPv4",myIPv4);

function login() {
    var logDat = document.getElementById("logInfo").getElementsByTagName("input");
    for (var n in logDat) {
        logDat[n].disabled = true;
    }
    var nReq = new XMLHttpRequest();
    var nURL = "http://" + myIPv4 + ":6689/login?manager=login&u=" + logDat[0].value + "&p=" + logDat[1].value;


    nReq.open("POST",nURL,true);
    nReq.onreadystatechange = function() {
        if (nReq.readyState == 4) {
            var n = JSON.parse(nReq.responseText).kii;
            console.log(n);
            if (n.charAt(0) == "-") {
                warn("iWarn",n.slice(1));
                logDat[1].value = "";
                for (var n in logDat) {
                    logDat[n].disabled = false;
                }
                return;
            } else {
                sessionStorage.setItem("kii",n);
                sessionStorage.setItem("u",logDat[0].value);
                document.location.href = "home.html";
            }
        }
    }
    nReq.send();
}

function createNew() {
    console.log("CREATING NEW");
    var logDat = document.getElementById("nInfo").getElementsByTagName("input");

    for (var n in logDat) {
        logDat[n].disabled = true;
    }

    if (logDat[1].value != logDat[2].value) {
        console.log("f");
        warn("nWarn","Passwords do not match!");
        logDat[1].value = "";
        logDat[2].value = "";
    } else {
        var nReq = new XMLHttpRequest();
        var nURL = "http://" + myIPv4 + ":6689/createNew?manager=login&u=" + logDat[0].value + "&p=" + logDat[1].value;
        console.log(nURL);
        nReq.open("POST",nURL, true);
        nReq.onreadystatechange = function() {
            if (nReq.readyState == 4) {
                var n = JSON.parse(nReq.responseText).kii;
                console.log(n);
                if (n.charAt(0) == "-") {
                    warn("nWarn",n.slice(1));
                    for (var n in logDat) {
                        logDat[n].disabled = false;
                    }
                    return;
                } else {
                    sessionStorage.setItem("kii",n);
                    sessionStorage.setItem("u",logDat[0].value);
                    document.location.href = "home.html";
                }
            }
        }
        nReq.send();
    }


}

function warn(tagName, msg) {
    document.getElementById(tagName).innerHTML = msg;
}