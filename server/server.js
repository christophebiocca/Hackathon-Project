var client_html = require('fs').readFileSync('../client/test_client.html');
var client_js = require('fs').readFileSync('../client/client.js');
var work_js = require('fs').readFileSync('../client/work.js');
var jquery_js = require('fs').readFileSync('../client/jquery-1.7.1.js')
var underscore = require('fs').readFileSync('./underscore.js');
var jade = require('fs').readFileSync('./jade.js');
var express = require("express");
var formidable = require('formidable');
var http = require('http');
var sys = require('sys');
var form = require('connect-form');

var app = require('express').createServer(form({ keepExtensions: true }));

app.configure(function(){
	app.set("view options", {layout: false});
});
app.use("/css", express.static(__dirname + '/views/css'));
app.use("/lib", express.static(__dirname + '/views/lib'));
app.get('/', function(req, res){
    res.render('./template.jade');
});

var models = require('./models');
var mandelbrotstuff = require('./mandelbrot_task.js');
console.log(mandelbrotstuff);
mandelbrotstuff.mandelbrot(80);
app.post('/upload', function(req, res, next){

  // connect-form adds the req.form object
  // we can (optionally) define onComplete, passing
  // the exception (if any) fields parsed, and files parsed
  req.form.complete(function(err, fields, files){
    if (err) {
      next(err);
    } else {
      console.log("File Uploaded Successfully");
      res.redirect('back');
    }
  });

  // We can add listeners for several form
  // events such as "progress"
  req.form.on('progress', function(bytesReceived, bytesExpected){
    var percent = (bytesReceived / bytesExpected * 100) | 0;
    process.stdout.write('Uploading: %' + percent + '\r');
  });
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


setInterval(models.cleanup, models.cleanupInterval);

everyone.now.getTask = function(retVal){
    models.Job.fetchTask(function(newTask, code){
        if(!newTask) return;
        var mapDatums = function(datum){
            return {k: JSON.parse(datum.key), v: JSON.parse(datum.value)};
        };
        var data = _.map(newTask.data, mapDatums);
        var taskId = newTask.taskId;
        console.log("Distributing task #", taskId, code, data);
        retVal(taskId, code, data);
    });
};

everyone.now.completeTask = function(taskid, data, retVal){
    console.log("Completed task #" + taskid + " results: " + JSON.stringify(data));
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
