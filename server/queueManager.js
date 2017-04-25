var wedis = require('./lib/wedis');
var wutil = require('./lib/wutil');
const Link = require('./link.js');

console.log("######");
console.log("## Booted queueManager.js");
console.log("###");


var crawledLinks = new Set();
var uncrawledLinks = new Set();


wedis.subscribe("addToQueue", function(cUrl){
	checkLink(cUrl);
});

var checkLink = function(url){

	console.log(url);
	var link = new Link(url);
	console.log(link.getState());

    wedis.exists(url + ":tries", function(reply){
    	console.log(reply);
        if(reply == null){
            wedis.crawler.addWork(url);
        }
    })


}





/* 

// Normalize link
	cUrl = wutil.cleanUrl(url);

	wedis.exists(cUrl + ":tries", function(reply){
		if(reply == null){
			wedis.crawler.addWork(cUrl);
		}
	}) 


*/