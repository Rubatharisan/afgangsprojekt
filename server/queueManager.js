var wedis = require('./lib/wedis');
var wutil = require('./lib/wutil');

console.log("######");
console.log("## Booted queueManager.js");
console.log("###");

wedis.subscribe("addToQueue", function(cUrl){
	checkLink(cUrl);
})

var checkLink = function(url){

	// Normalize link
	cUrl = wutil.cleanUrl(url);

	wedis.exists(cUrl, function(reply){
		if(reply != null){
			console.log(cUrl + " already exists in Redis");
		} else {
			wedis.crawler.addWork(cUrl);
		}
	})

}