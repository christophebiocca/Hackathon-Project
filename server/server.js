var client_html = require('fs').readFileSync('../client/test_client.html');
var httpServer = require('http').createServer(function(req, response){
    response.end(html);
})
var app = require('express').createServer();

app.get('/', function(req, res){
    res.end(client_html);
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
