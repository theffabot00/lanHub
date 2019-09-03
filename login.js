
var fs = require('fs');

//maybe it wasnt so much as i couldnt
//as much as i was just dumb confused and terrified of the weird syntax for the child process module
//whats with { spawn } as a varianble name??? whats with the curlies??

//i think i kinda understand whats happening here
//the curlies make it a function? maybe? 
var  spawn = require('child_process').spawn;

//i dont know mysql
//i tried, but i couldnt even figure out how to launch the sevrer :((


exports.manage = function(name, dat, cb) {


    //ill explain some stuff here
    //"kii" is a corrupt spelling for "key", but it can also carry error messages like passwordMismatch
    //it delivers the key the user will use to authenticate themselves or something like that

    if (name == "createNew") {

        //always put the optimal/best condition first (is what i tell myself), so the successfully created condition goes first
        if (!fs.existsSync("users/" + dat.u + ".USER")) {
            fs.appendFile("users/" + dat.u + ".USER", "",function(err) {
                if (err) {
                    throw err
                } 

                var nUser = new File("users/" + dat.u + ".USER", function() {

                    nUser.dat = {
                        "password":dat.p,
                        "stats":{}
                    }
                    nUser.save( function() {
                        exports.manage("login",dat, cb);
                    });
                    

                });
            });

        } else {
            cb({
                "kii":"-Username taken"
            });
        }
    }

    if (name == "login") {
        if (fs.existsSync("users/" + dat.u + ".USER")) {
            fs.readFile("users/" + dat.u + ".USER", function(err,uInfo) {
                //idk what utf 8 is so i guess im jsut gonna do whatever tostring does
                uInfo = JSON.parse(uInfo.toString());
                if (uInfo.password == dat.p) {


                    sufficientString(function(newKii) {
                        console.log("GENERATED KII " + newKii);
                        // while (needNewKey || ) {
                        //     if (loggedInUsers[newKii] != null ) {
                        //         newKii = summonString();
                        //     } else {
                        //         needNewKey = false;
                        //     }
                        // }
                        exports.loggedInUsers[newKii] = dat.u;
                        cb({
                            "kii":newKii
                        });
                    });
                    



                } else {
                    cb({
                        "kii":"-Username-password combination not found"
                    })
                }
            });
        } else {
            cb({
                "kii":"-User does not exist"
            });
        }
    }

    if (name == "auth") {
        console.log("AUTHING");
        //this one will see a dat.u and a dat.kii 
        if (dat.u == exports.loggedInUsers[dat.kii]) {
            
            cb({"kii": true });
        } else {
            console.log("got " + dat.u + " and " + dat.kii + " BUT was expecting " + exports.loggedInUsers[dat.kii] +" and " + dat.kii);
            cb({"kii": false });
            delete exports.loggedInUsers[dat.kii];
        }
    }

}

//no promises! :)
class File {
    constructor(path, callBack) {
        if (fs.existsSync(path)) {
            this.file = path;
            this.dat = {};
            this.open(callBack);
        } else {
            fs.appendFile(path,"q",function(err) {
                this.file = path;
                this.dat = {};
                this.open(callBack);
            });
        }

    }

    open(cb) {

        fs.readFile(this.file, function(err,dat) {
            cb();
        });
    }

    save(cb) {
        fs.writeFile(this.file, JSON.stringify(this.dat), function(err) {
            if (err) throw err;
            cb();
        });
    }
}


//this is the big confuse
//i confess i basically jsut stole this
function summonString(cb) {
    // var instance = spawn('java',['-jar','generateString.jar','9']);
    var instance = spawn('java',['randomString','9']);
    instance.stdout.on("data", function(data) {
        cb(data.toString());
    });
    instance.stderr.on("data", function (data) {
        cb("ERR");
    });
}

function sufficientString(cb) {
    var nS = summonString(function(someString){
        if (exports.loggedInUsers[someString] != null || someString == "ERR") {
            console("REROLL");
            sufficientString(cb);
        } else {
            cb(someString);
        }
    })
}


//think of this as a shitty database?
//imagine how cool it would be if i knew how to operate mysql 

exports.loggedInUsers = {
    //the idea is that this object will full up with kii : username pairs
}
