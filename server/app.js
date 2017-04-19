var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var normalizeUrl = require('normalize-url');

io.on('connection', function(socket){
    console.log('A client connected');

    socket.emit('response', { 
    	output: 'You succesfully connected to the server' 
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
            output: "Received url to scan: " + normalizeLink(task.url)
        }

        //initCrawl(task.url, socket);
        testRedis();

        sendResponse(socket, 'response', info);
    }

}

var testRedis = function(){
    var redis = require("redis"),
    client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.set("string key", "string val", redis.print);
}

var initCrawl = function(url){
	console.log(url);

	// @TODO: Check if url is legit
	var cUrl = url;

	// @TODO: Create entry in Redis with unique normalized link
	cUrl = normalizeLink(url);

    request(cUrl, function(error, response, html){

    	var pageLinks = [];

        if(!error){

            var $ = cheerio.load(html);

            $("a").each(function() {
                if(typeof(this.attribs.href) !== "undefined"){
                    process.stdout.write(this.attribs.href);
                    process.stdout.write("          =>          ");
                    process.stdout.write(normalizeUrl(this.attribs.href));

                }

            	console.log();
			})


        } else {
        	console.log(error);
        }


        console.log(response);

    })


}

var normalizeLink = function(url){
	return normalizeUrl(url);
}


http.listen(3000, function(){
  console.log('listening on *:3000');
  //sendResponse("I am cool ;)");
});
