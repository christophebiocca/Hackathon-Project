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
            }, 500);
        };
        worker.onmessage = function(event){
            if (event.data.type === "DataRequest"){     //if the worker requests data
                console.log('data requested');          //for debugging
                
				startNewTask();
            };
            
			if (event.data.type === "DataReturn"){
                console.log('data returned');
                console.log(event.data.Data[0].k);
                console.log(event.data.Data[0].v);
                console.log(event.data)
            };
        };
        now.ready(function () {
            startNewTask();
        });
    };
});