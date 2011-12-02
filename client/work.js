pause = function (millis) {
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); }
    while (curDate - date < millis)
}

//the mapper. returns a string represent the result of the processing, which is then returned to the server.
var mapData = function(dataString){
    pause(5000);
    setTimeout();
    return("test return");
};
self.onmessage = function (event) {
    self.postMessage({'type':'DataReturn', 'Data':mapData(event.data)});
    self.postMessage({'type':'DataRequest'});
};
self.postMessage({'type':'DataRequest'});