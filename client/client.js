$(document).ready(function () {
    if (!!window.Worker) {
        var worker = new window.Worker("work.js");
        var currentTaskId;
        var currentTaskIntervalID;
        var startNewTask = function () {
            now.getTask(function (taskId, code, data) {
                currentTaskId = taskId;
                worker.postMessage({ 'type': 'NewMapFunction', 'NewFunction': String(code) });
                worker.postMessage({ 'type': 'NewData', 'NewData': data });
            });
            clearInterval(currentTaskIntervalID);
            currentTaskIntervalID = setInterval(function () {
                now.heartbeat(currentTaskId);
            }, 5000);
        };
        worker.onmessage = function(event){
            if (event.data.type === "DataRequest"){     //if the worker requests data
                console.log('data requested');          //for debugging
                
				startNewTask();
            };
            
			if (event.data.type === "DataReturn"){
                console.log('data returned');
                console.log(event.data.Data.k);
                console.log(event.data.Data.v);
            };
        };
        now.ready(function () {
            startNewTask();
        });
    };
});