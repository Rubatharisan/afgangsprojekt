var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var wedis = require('./lib/wedis');

console.log("######");
console.log("## Booted app.js");
console.log("###")

io.on('connection', function(socket){
    console.log('Client connected');

    socket.emit('response', { 
    	output: 'Server connected' 
    });

    socket.on('request', function (task) {
        handleTask(task, socket);
    });

});

var sendResponse = function(socket, channel, message){
    socket.emit(channel, message);
}

var handleTask = function(task, socket){

    if(task.action == 'crawl'){

        var info = {
            output: "URL: " + normalizeUrl(task.url)
        }

        wedis.addToQueue(normalizeUrl(task.url));

        sendResponse(socket, 'response', info);
    }

}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
