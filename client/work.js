importScripts('underscore.js');

pause = function (millis) {
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); }
    while (curDate - date < millis)
}

//the mapper. returns a string represent the result of the processing, which is then returned to the server.

//if you change the paramaters, you have to change the eval() in onmessage
var clientCode;

var mapData = function (k,v,collector) {
    pause(300);
    clientCode(k,v,collector);
};

self.onmessage = function (event) {
    if (event.data.type === 'NewMapFunction'){
        eval('clientCode = ' + event.data.NewFunction + ';');
    };
    if (event.data.type === 'NewData'){
        var results = [];
        _.each(event.data.NewData, function(datum){
            mapData(datum.k, datum.v, function (k, v) {
                results.push({'k':k,'v':v});
            });
        });
        self.postMessage({'type': 'DataReturn', 'Data': results});
    };
};
