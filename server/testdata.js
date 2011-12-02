var models = require('./models');
var uuid = require('node-uuid');

var getData = function(){
    var dataset = [];
    for(var i = 0; i < 10; ++i){
        var input = [];
        for(var j = 0; j < 10; ++j){
            input.push({k: 'a'+i, v: j}); 
        }
        dataset.push({data: input});
    }
    return dataset;
};


var createJob = function(){
    var job = new models.Job({
        mapper: String(function(k,v,out){out(k,v)}),
        reducer: String(function(k,v,out){out(k,v)}),
        mapInput: getData()
    });
    console.log(job);
    job.save(function(err){
        if(err){
            console.error(err);
        } else {
            console.log("Added job");
            console.log(job);
        }
    });
}

setInterval(createJob, 10000);
