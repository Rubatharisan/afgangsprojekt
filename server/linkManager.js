var wedis = require('./lib/wedis');
var wutil = require('./lib/wutil');
const Link = require('./link.js');

console.log("######");
console.log("## Booted linkManager.js");
console.log("###");


var crawledLinks = new Set();
var uncrawledLinks = new Set();


wedis.subscribe("addToQueue", function(cUrl){
	console.log(cUrl);
	console.log(checkLink(cUrl));
});

wedis.subscribe("markLinkCrawled", function(cUrl){
	markLinkCrawled(cUrl);
});


var checkLink = function(cUrl){
	if(crawledLinks.has(cUrl)){
		return true;
	} else {
		return false;
	}

}

var markLinkCrawled = function(url){

	console.log(url);
	var link = new Link(url);
	console.log(link.getState());

	client.set('cUrl', 'crawled', function(){
		crawledLinks.add()
	});


}

var addLinkToUncrawled = function(url){

	console.log(url);

}