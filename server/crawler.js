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


var subscribe = function() {
    wedis.subscribe('crawlers', function() {
        wedis.crawler.getWork(function(cUrl) {
            console.log(cUrl);
            unsubscribe(function() {
                client.get(cUrl, function(e, msg) {
                    client.get(cUrl + ":tries", function(e, msg) {
                        console.log(msg);
                        if (msg == null) {
                            crawl(cUrl);
                        }
                    });
                });
            });
        });

    })
}

subscribe();

var unsubscribe = function(callback) {
    wedis.unsubscribe('crawlers', callback);
}

/* 
## Executing work 
*/

var crawl = function(cUrl) {
        console.log("Received " + cUrl + " to crawl"); 
        client.get(cUrl, function(e, msg) {
            if(msg != "processing" && msg != "crawled"){
                request(cUrl, function(error, response, html) {
                    client.set(cUrl, 'processing', function() { // Switch with the above condition
                    wedis.setTries(cUrl);

                    if (!error) {

                        var $ = cheerio.load(html);

                        console.log("State: " + msg);
                        console.log("Page titel: " + $('title').text());
                        console.log("URL: " + cUrl);
                        console.log();


                        console.log($("a").length);

                        var set = new Set();

                        $("a").each(function(i) {
                            if (typeof(this.attribs.href) !== "undefined") {


                                if (this.attribs.href.charAt(0) == '/') {
                                    this.attribs.href = wutil.appendRelativePath(cUrl, this.attribs.href);
                                }

                                if (this.attribs.href.indexOf(wutil.getHostnameByUrl(cUrl)) !== -1) {
                                    wedis.setInternalLink(cUrl, wutil.cleanUrl(this.attribs.href));
                                    wedis.appearsOn(wutil.cleanUrl(this.attribs.href), cUrl); // Double check this
                                    set.add(this.attribs.href);
                                } else {
                                    //wedis.setExternalLink(cUrl, wutil.cleanUrl(this.attribs.href));
                                }

                            }

                            //console.log(i);

                            if (i === $("a").length - 1) {
                                wedis.setData(cUrl, html);

                                wedis.setHttpStatus(cUrl, response.statusCode);

                                wedis.setState(cUrl, "crawled", function() {
                                    subscribe();
                                });

                                set.forEach( function(element, index) {
                                    //console.log(element);
                                    wedis.addToQueue(wutil.cleanUrl(element));
                                });

                                //console.log(set);
                            }

                        });



                    } else {
                        console.log(error);
                    }


                });

                });
            }
        });
}

