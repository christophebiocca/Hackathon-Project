pause = function (millis) {
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); }
    while (curDate - date < millis)
}

//the mapper. returns a string represent the result of the processing, which is then returned to the server.

//if you change the paramaters, you have to change the eval() in onmessage
var mapData = function (k,v,collector) {
    pause(5000);
    collector(k,v);
};

self.onmessage = function (event) {
    if (event.data.type === 'NewMapFunction'){
        eval('mapData = function(k,v,collector){pause(5000);return(' + event.data.NewFunction + '(k,v,collector))};');
        self.postMessage({ 'type': 'DataRequest' });
    };
    if (event.data.type === 'NewData'){
		_.each(data, function(datum){
			mapData(event.datum.k, event.datum.v, function (k, v) {
				self.postMessage({ 'type': 'DataReturn', 'Data': {'k':k,'v':v}});
			});
		});


        self.postMessage({ 'type': 'DataRequest' });
    };

	
};