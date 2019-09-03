
//imagine an int[] args
function Flow() {
    for (var n in arguments) {
        this.push(arguments[n]);
    }
}

Flow.prototype = Array.prototype;

Flow.prototype.getNextRight = function(someIdx) {
    if (someIdx == this.length - 1) {
        return(this[0]);
    } else {
        return(this[someIdx + 1]);
    }
}

Flow.prototype.getNextLeft = function(someIdx) {
    if (someIdx == 0) {
        return(this[this.length - 1]);
    } else {
        return(this[someIdx - 1]);
    }
}
