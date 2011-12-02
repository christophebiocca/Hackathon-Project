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
			if (event.data.type === "DataReturn"){
                clearInterval(currentTaskIntervalID);
			    now.completeTask(currentTaskId, event.data.Data, function () { });
			    startNewTask();
            };
        };
        now.ready(function () {
            startNewTask();
        });
    };
});