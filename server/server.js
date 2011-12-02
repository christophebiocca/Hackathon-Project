var client_html = require('fs').readFileSync('../client/test_client.html');
var underscore = require('fs').readFileSync('./underscore.js');
var httpServer = require('http').createServer(function(req, response){
    response.end(html);
})
var app = require('express').createServer();

app.get('/', function(req, res){
    res.end(client_html);
});

app.get('/underscore.js', function(req, response){
    response.end(underscore);
});

app.get('Drew put path here!', function(req, res){
    res.end('YOU NEED A FILE PATH HERE.');
});

app.listen(8080);

var nowjs = require("now");
var everyone = nowjs.initialize(app);

everyone.now.logStuff = function(msg){
    console.log(msg);
}

var uuid = require('node-uuid');
var _ = require('underscore');



everyone.now.getTask = function(retVal){
    // Right now, just return a fake task.
    var taskid = uuid.v4();
    var code = String(function(k,v,out){out(k,v);});
    var data = [{k: 1, v: 2}, {k:22, v:999}];
    console.log('Sent out task #' + taskid);
    retVal(uuid.v4(), code, data);
};

everyone.now.completeTask = function(taskid, data, retVal){
    console.log("completed task #" + taskid);
    // Right now, we don't do anything.
    retVal("OK");
};

everyone.now.heartbeat = function(taskid){
    console.log("Got heartbeat for task #" + taskid);
    // Right now, we don't do anything.
};
