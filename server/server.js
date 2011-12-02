var client_html = require('fs').readFileSync('../client/test_client.html');
var client_js = require('fs').readFileSync('../client/client.js');
var work_js = require('fs').readFileSync('../client/work.js');
var jquery_js = require('fs').readFileSync('../client/jquery-1.7.1.js')
var underscore = require('fs').readFileSync('./underscore.js');
var jade = require('fs').readFileSync('./jade.js');
var express = require("express");

var httpServer = require('http').createServer(function(req, response){
    response.end(html);
})
var app = require('express').createServer();

app.configure(function(){
	app.set("view options", {layout: false});
});
app.use("/css", express.static(__dirname + '/views/css'));
app.use("/lib", express.static(__dirname + '/views/lib'));
app.get('/', function(req, res){
    res.render('./template.jade');
});

app.get('/client.js', function (req, res) {
    res.end(client_js);
});

app.get('/test_client.html', function (req, res) {
    res.end(client_html);
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
    models.Job.fetchTask(function(newTask, code){
        console.log(newTask);
        var mapDatums = function(datum){
            return {k: JSON.parse(datum.key), v: JSON.parse(datum.value)};
        };
        var data = _.map(newTask.data, mapDatums);
        var taskId = newTask.taskId;
        console.log("Returning task #", taskId);
        retVal(taskId, code, data);
    });
};

everyone.now.completeTask = function(taskid, data, retVal){
    console.log("completed task #" + taskid + " results: " + JSON.stringify(data));
    var encodedData = _.map(data, function(datum){
        return {key: JSON.stringify(datum.k), value: JSON.stringify(datum.v)};
    });
    models.Job.commitResults(taskid, encodedData);
    retVal("OK");
};

everyone.now.heartbeat = function(taskid){
    console.log("Got heartbeat for task #" + taskid);
    models.Job.heartbeat(taskid);
};
