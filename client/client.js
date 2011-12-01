$(document).ready(function () {
    if (!!window.Worker) {
        var worker = new window.Worker("work.js");
        worker.onmessage = function(event){
            if (event.data.type === "DataRequest"){
                console.log('data requested');
                worker.postMessage("test data");
            }
            if (event.data.type === "DataReturn"){
                console.log('data returned' + event.data.Data)
            }
        }
    };
});