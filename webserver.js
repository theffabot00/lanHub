


var http = require('http');
var fs = require('fs');
var url = require('url');


var ip = require('ip');
var qs = require('qs');


var fm = require('./fileManager');
var login = require("./login");
var gi = require('./gameData');
var solo = require('./soloGame');



http.createServer(function(req, res){

    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","X-Requested-With, contenttype");
    res.setHeader("Access-Control-Allow-Credentials",true);

    var nURL = url.parse(req.url);
    var reqName = nURL.pathname.substring(1);

    var reqData = qs.parse(nURL.query);


    console.log( "requested for " + reqName );
    console.log(reqData);

    // console.log(reqData);

    if (reqName == "") {     //first ping?
        res.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("index.html",function(err,dat){
            if (err) {
                console.log('SURRENDER');
            } else {
                res.write(dat.toString());
            }
            res.end();
        });
    }

    if (reqName.indexOf(".") != -1) {
        var typBlock = fm.retrieveType(reqName.substr(reqName.indexOf(".")+1));
        res.writeHead(200,{"Content-Type":typBlock.typ + "/" + typBlock.ext});
        fs.readFile(reqName, function(err,dat){
            if (err) {
                console.log("REQUESTED FOR NONEXISTANT FILE");
                throw err;
            } else {
                if (typBlock.typ != "text") {
                    res.write(dat, "binary");
                } else {
                    res.write(dat.toString());
                }
            }
            res.end();
        });
    }

    //the glorious sorting hat!
    var manager = reqData.manager;
    if (manager == "login") {
        login.manage(reqName, reqData, function(msg) {
            console.log("sending msg" + JSON.stringify(msg));
            res.end(JSON.stringify(msg));
        });

        // res.end(JSON.stringify(n));

    }
    if (manager == "soloGame") {
        solo.manage(reqName, reqData, function(msg){
            console.log("sending msg" + JSON.stringify(msg));
            res.end(JSON.stringify(msg));
        });
    }
    if (manager == "gameInfo") {
        gi.manage(reqName, reqData, function(msg) {
            console.log("sending msg" + JSON.stringify(msg));
            res.end(JSON.stringify(msg));
        });
    }


}).listen(6689);








