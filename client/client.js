$(document).ready(function () {
    if (!!window.Worker) {
        var worker = new window.Worker("work.js");
        worker.onmessage = function(event){
            if (event.data.type === "DataRequest"){
                console.log('data requested');
                worker.postMessage({'type': 'NewData', 'NewData':'A string'});
            }
            if (event.data.type === "DataReturn"){
                console.log('data returned' + event.data.Data)
            }
        }
        worker.postMessage({ 'type': 'NewData', 'NewData': 'A string' });
        worker.postMessage({'type': 'NewMapFunction', 'NewFunction':"function(){return(\"new map\");pause(5000);}"});
    };
});