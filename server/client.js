$(document).ready(function () {
    if (!!window.Worker) {
        var worker = new window.Worker("work.js");
        worker.onmessage = function(event){
            console.log(event);
        }
        worker.postMessage("sent the worker a message!");
    };
});