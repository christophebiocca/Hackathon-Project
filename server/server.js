var client_html = require('fs').readFileSync('../client/test_client.html');
var client_js = require('fs').readFileSync('../client/client.js');
var work_js = require('fs').readFileSync('../client/work.js');
var jquery_js = require('fs').readFileSync('../client/jquery-1.7.1.js')
var underscore = require('fs').readFileSync('./underscore.js');

var httpServer = require('http').createServer(function(req, response){
    response.end(html);
})
var app = require('express').createServer();

app.get('/', function(req, res){
    res.end(client_html);
});

app.get('/client.js', function (req, res) {
    res.end(client_js);
});

app.get('/work.js', function (req, res) {
    res.end(work_js);
});

app.get('/jquery-1.7.1.js', function (req, res) {
    res.end(jquery_js);
});

app.get('/underscore.js', function(req, response){
    response.end(underscore);
});

app.listen(8080);

var nowjs = require("now");
var everyone = nowjs.initialize(app);

everyone.now.logStuff = function(msg){
    console.log(msg);
}

var uuid = require('node-uuid');
var _ = require('underscore');


var models = require('./models');
setInterval(models.cleanup, models.cleanupInterval);

everyone.now.getTask = function(retVal){
    // Right now, just return a fake task.
    var taskid = uuid.v4();
    var code = String(function(k,v,out){out(k,v);});
    var data = [{k: {x:1, y:1}, v: 2}, {k:{x:0.5, y:0.5}, v:999}];
    console.log('Sent out task #' + taskid);
    retVal(taskid, code, data);
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
