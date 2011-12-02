pause = function (millis) {
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); }
    while (curDate - date < millis)
}

//the mapper. returns a string represent the result of the processing, which is then returned to the server.
var mapData = function(dataString){
    return("no map function");
};

self.onmessage = function (event) {
    if (event.data.type === 'NewMapFunction'){
        eval('mapData = ' + event.data.NewFunction);
        self.postMessage({ 'type': 'DataRequest' });
    };
    if (event.data.type === 'NewData'){
        self.postMessage({ 'type': 'DataReturn', 'Data': mapData(event.data.NewData) });
        self.postMessage({ 'type': 'DataRequest' });
    };
};