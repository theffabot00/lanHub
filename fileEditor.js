
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



exports.createNewFile = new File(pth, call);