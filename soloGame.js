
var fs = require('fs');
var { spawn } = require('child_process');


exports.manage = function(name, dat, callBack) {
    if (name == "getNames") {
        fs.readFile("soloGameData/gameList.JSON",function(err, data) {
            if (err) throw err;
            //the datatype for this might change
            callBack(JSON.parse(data));
        });
    }
    //i think this is unnecessary and can be stored on client but ill jsut keep it here just so i can leave the client in the dark
    if (name == "getGameScreen") {
        console.log("GETTING GAME SCREEN")
        var gCode = dat.gID.split("/");
        if (gCode[0] == "s") {
            var s = "soloGameData/gamePages/" + gCode[1] + "/" + gCode[1] + ".html";
            callBack({ s });
        }
    }


    //the nast game management things 
    if (name == "createNewInstance") {
        generateGKii(dat.gID,function(nGKii){
            //anything that hits this function is already a sologame so im not going to fret over the s
            var gameType = dat.gID.split("/")[1];
            var index = -1;
            for (var n = 0; index == -1; n++) {
                if (spawns[n] == null) {
                    index = n;
                }
            }

            gameKiis[nGKii] = {
                //index is type int
                "index":index,
                "kii":dat.kii
            };
            if (gameType == "con4") {
                spawns[index] = spawn('python', ['con4.py'], {'cwd':'soloGameData'});
                console.log("SPAWN SET AT INDEX " + index);
                spawns[index].on("close", function() {
                    spawns[index] = null;
                    //this is VERY BAD; FIND A SOLUTION TO THIS ASAP
                    delete gameKiis[nGKii];
                });
                spawns[index].stderr.on("data", function(err) {
                    console.log(err.toString());

                });
                //dont write the stdins and outs here
            }
            callBack({"gKii":nGKii});
        });
    }

    if (name == "updateCon4") {
        if (gKiiAuth(dat.kii, dat.gKii)) {
            //step 1: get instance
            var someChild = spawns[gameKiis[dat.gKii]["index"]];
            console.log('ACCESSING SPAWN NUMBER ' + gameKiis[dat.gKii]["index"]);
            //step 2 prep response capture

            someChild.stdout.on("data", function (data){
                console.log("DATA EXISTS " + data.toString());
                data = data.toString().split("||");
                data[0] = data[0].split("\r\n");
                if (data[1]) {
                    data[1] = data[1].split("\r\n");
                    data[1].shift();
                }
                console.log(data);
                if (data[1]) {
                    var someObj = {
                        "pState": data[0],
                        "bState": data[1]
                    };
                    callBack(someObj);
                    return;
                } else { 
                    var someObj = {
                        "pState": data[0]
                    };
                    callBack(someObj);
                    return;
                } 
            });
            //step 3 drop data into instance
            someChild.stdin.setEncoding('utf-8');
            someChild.stdin.write(dat.col + "\n");
            // someChild.stdin.end();
            
            //step 4 capture and send
            //theres nothing here because it gets done in step 2
        } 

    }

    if (name == "checkForGame") {
        //goal here is just see if a gKii exists
        if (gameKiis[dat.gKii]) {
            callBack("EXISTS");
        } else {
            callBack("DNE");
        }
    }
}

function gKiiAuth( uKii, gKii) {
    var someDat = gameKiis[gKii];
    if (someDat != null) {
        if (someDat.kii == uKii) {
            console.log("SUC");
            return true;
        } 
        console.log(someDat.kii + " is not " + uKii);
    }
    return false;
}

function generateGKii(gID, callBack) {
    var instance = spawn('java',['randomString','9']);
    instance.stdout.on("data", function(data) {
        if (gameKiis[gID + data.toString()] == null) {
            callBack(gID + data.toString());
        } else {
            generateGKii(gID, callBack);
        }
        
    });
}


var spawns = [null]; //this gets filled with spawn instance things (godbless not declaring type)
var gameKiis = {
    //this gets killed with things looking like
    //"gkii": {
    //  "index":i,
    //  "userKii":kii
    //}
}