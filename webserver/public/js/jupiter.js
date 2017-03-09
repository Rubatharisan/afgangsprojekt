var socket = io(':3000');


socket.on('response', function (response) {
    appendOutput(response);
});

var appendOutput = function(response){
    $("#output").prepend(response.output);
    $("#output").prepend('<br>');
}

$('#scanButton').on('click', function(){
    var crawl = {
        action: 'crawl',
        url: 'http://morningcheck.dk'
    }

    sendMessage('request', crawl);
});

var sendMessage = function(channel, task){
    socket.emit(channel, task);
}