$(document).ready(function () {
    if (!!window.Worker) {
        var worker = new window.Worker("work.js");
        worker.onmessage = function(event){
            if (event.data.type === "DataRequest"){     //if the worker requests data
                console.log('data requested');          //for debugging
                
				//
				now.ready(function () {						
                    now.getTask(function (taskId, code, data) {
                        worker.postMessage({ 'type': 'NewMapFunction', 'NewFunction': String(code) });
                        _.each(data, function (datum) {
                            worker.postMessage({ 'type': 'NewData', 'NewData': datum });
                        });
                    });
                });
				
				
            }
            
			if (event.data.type === "DataReturn"){
                console.log('data returned');
                console.log(event.data.Data.k);
                console.log(event.data.Data.v);
            }
        }
		
        now.ready(function () {
            now.getTask(function (taskId, code, data) {
                worker.postMessage({ 'type': 'NewMapFunction', 'NewFunction': String(code)});
                worker.postMessage({ 'type': 'NewData', 'NewData': data });
            });
        });
    };
});