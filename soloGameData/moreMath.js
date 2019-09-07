

exports.randInt = function(low, high) {
    var diff = (high - (low - 1));
    var rando = Math.ceil( Math.random() * diff) + (low - 1) ;
    return(rando);
}