var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket){
    console.log('A user connected');
    socket.emit('response', { output: 'You succesfully connected to the server' });

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
            output: "Received url to crawl: " + task.url
        }

        sendResponse(socket, 'response', info);
    }

}



http.listen(3000, function(){
  console.log('listening on *:3000');
  //sendResponse("I am cool ;)");
});
