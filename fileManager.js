



const types = [
    {
        "ext":"html",
        "typ":"text"
    },
    {
        "ext":"css",
        "typ":"text"
    },
    {
        "ext":"js",
        "typ":"text"
    },
    {
        "ext":"ico",
        "typ":"image"
    }

];

exports.retrieveType = function(fileExt) {
    for (var n in types) {
        if (types[n].ext == fileExt) {
            return(types[n]);
        } 
    }
    //inb4 images spam
    return({
        "type":"UNKNOWN",
        "style":"binary"
    });
}


