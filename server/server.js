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
    // Right now, just return a fake task.
    var taskid = uuid.v4();

    var code = String(function(k,v,output){
	var colorVal = function(x,y){
		
		var i = 0;
		var xnew = x;
		var ynew = y;
		var xold = x;
		var yold = x;
		var value;
		for(i = 0; i<1000000; ++i){

			xnew = (xold^2) + (yold^2);
			ynew = 2*xold*yold;

			value = Math.sqrt(xnew^2 + ynew^2);

			if(value>2){
				return i;
			}


			yold = ynew;
			xold = xnew;
		}
		return 1000000;

	}
		var color = colorVal(k.x,k.y)/3921.5;
		color = parseInt(color);
		output(k,color);
	});
    
    var data = [{k: {x:1, y:1}, v: 2}, {k:{x:0.5, y:0.5}, v:999}];

    console.log('Sent out task #' + taskid);
    retVal(taskid, code, data);
};

everyone.now.completeTask = function(taskid, data, retVal){
    console.log("completed task #" + taskid + " results: " + JSON.stringify(data));
    // Right now, we don't do anything.
    retVal("OK");
};

everyone.now.heartbeat = function(taskid){
    console.log("Got heartbeat for task #" + taskid);
    // Right now, we don't do anything.
};
