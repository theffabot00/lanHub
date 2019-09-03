
var fs = require('fs');


exports.manage = function(name, dat, callBack) {

    if (name == "getGameDesc") {
        gCode = dat.gID.split("/");

        if (gCode[0] == "s") {
            fs.readFile("soloGameData/gameInfo.JSON", function(err, data) {
                var someJSON = JSON.parse(data);
                callBack(someJSON[gCode[1]]);
            });
        }
    }
}