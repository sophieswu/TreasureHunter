var express = require('express');
var app = express ();
var server = require('http').Server(app);
var port = process.env.PORT || 3030;

server.listen(port, function(){
	console.log("Listening on port *:" + port);
});

app.use(express.static(__dirname));
app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});
