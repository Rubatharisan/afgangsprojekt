var request = require('request');
var cheerio = require('cheerio');

var wedis = require('./lib/wedis');
var wutil = require('./lib/wutil');

console.log("######");
console.log("## Booted crawler.js");
console.log("###");

var redis = require("redis"),
    client = redis.createClient();


/* 
## Waiting for work
*/


var subscribe = function(){
	wedis.subscribe('crawlers', function(){

		wedis.crawler.getWork(function(cUrl){
			unsubscribe(function(){
				client.get(cUrl, function(e, msg){
				   if(msg != "null" &&
				   msg != null && 
				   msg != undefined && 
				   msg != "processing" && 
				   msg != "crawled"){
				   	client.get(cUrl + ":tries", function(e, msg){
				   		if(msg == null){
							crawl(cUrl);
				   		}
				   	});
				   }
				});
			});
		});

	})
}

subscribe(); 

var unsubscribe = function(callback){
	wedis.unsubscribe('crawlers', callback);
}

/* 
## Executing work 
*/

var crawl = function(cUrl){
	client.get(cUrl, function(e, msg){
		if(msg != "null" &&
		   msg != null && 
		   msg != undefined && 
		   msg != "processing" && 
		   msg != "crawled"){
			console.log("State: " + e);
			client.set(cUrl, 'processing', function(){
				client.get(cUrl, function(e, msg){
					request(cUrl, function(error, response, html){
						wedis.setTries(cUrl);

			            if(!error){

			                var $ = cheerio.load(html);

			                console.log("State: " + msg);
			                console.log("Page titel: " +  $('title').text());
			                console.log("URL: " + cUrl);
			                console.log(); 

			                $("a").each(function(i) {
			                    if(typeof(this.attribs.href) !== "undefined"){


			                        if(this.attribs.href.charAt(0) == '/'){
			                            this.attribs.href = wutil.appendRelativePath(cUrl, this.attribs.href);
			                        }

			                        if(this.attribs.href.indexOf(wutil.getHostnameByUrl(cUrl)) !== -1){
			                        	wedis.setInternalLink(cUrl, wutil.cleanUrl(this.attribs.href));
			                        	wedis.appearsOn(cUrl, wutil.cleanUrl(this.attribs.href));
			                           	wedis.addToQueue(this.attribs.href);
			                        }

			                    }

			                });

			                wedis.setData(cUrl, html);

				            wedis.setHttpStatus(cUrl, response.statusCode);

				            wedis.setState(cUrl, "crawled", function(){
				            	subscribe(); 
				            });

			            } else {
			                console.log(error);
			            }


		    		});
				});
			});
	};
});
}






