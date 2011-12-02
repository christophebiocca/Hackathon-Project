var html = require('fs').readFileSync('../client/test_client.html');
var httpServer = require('http').createServer(function(req, response){
    response.end(html);
})
httpServer.listen(8080);

var nowjs = require("now");
var everyone = nowjs.initialize(httpServer);

everyone.now.logStuff = function(msg){
    console.log(msg);
}
