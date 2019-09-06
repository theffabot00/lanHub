
function constMoveHTML(someHTML, someCSSProp, startInPx, endInPx, velInPxPerS,callBack) {
    startInPx = parseFloat(startInPx);
    endInPx = parseFloat(endInPx);
    someHTML.style[someCSSProp] = startInPx + "px";
    var time = (endInPx - startInPx) / velInPxPerS;
    constNumberChange(startInPx, endInPx, time, function(pixel) {
        someHTML.style[someCSSProp] = pixel + "px";
        if (endInPx >= pixel) {
            callBack();
        }
    });
}

function constNumberChange(start, end, time, callBack) {
    var currentNumber = start;
    //time is in seconds
    var change = (end - start) * (.01 / time);
    var up = setInterval(function() {
        currentNumber += change;
        if (currentNumber >= end) {
            currentNumber = end;
            clearInterval(up);
        }
        callBack(currentNumber);
    }, 10)
}