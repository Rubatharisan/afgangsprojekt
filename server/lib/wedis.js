var redis = require("redis"),
    client = redis.createClient();

var pub = redis.createClient();
var sub = redis.createClient();


const crawlersWaitQueue = "crawlers:waitQueue";
const crawlersWorkQueue = "crawlers:workQueue";

var wedis = {

	appearsOn : function(target, source){
		client.sadd(target + ":appears_on", source);
	},

	addToQueue : function(cUrl){
		// client.get(cUrl, function(err, reply){
		// 	if(reply == null || reply == "null"){
	 //    		pub.publish("addToQueue", cUrl);
	 //    	}
	 //    });
	 client.exists(cUrl, function(err, msg){
	 	if(msg == 0){
	 		client.set(cUrl, 'received', function(){
	     		pub.publish("addToQueue", cUrl);
			});
	 	}
	 });
	 
	},

	setTries : function(cUrl){
    	client.incr(cUrl + ":tries");
	},

	setState : function(cUrl, state, callback){
		client.set(cUrl, state, function(){
	    	client.hset(cUrl + ":crawl", 'state', state, callback);
	    });
	},

	setHttpStatus : function(cUrl, status, callback){
	    client.hset(cUrl + ":http", 'code', status, callback);
	},

	setData : function(cUrl, data, callback){
		client.hset(cUrl + ":data", 'html', data, callback);
	},

	setInternalLink : function(cUrl, link, callback){
		client.sadd(cUrl + ":internal_links", link, callback);
	},

	setExternalLink : function(cUrl, link, callback){
		client.sadd(cUrl + ":external_links", link, callback);
	},

	crawler : {

		addWork : function(cUrl, callback){
			console.log(cUrl);

			client.get(cUrl, function(err, reply){
				if(reply != 'inqueue' && reply != 'processing' && reply != 'crawled'){
					client.lpush(crawlersWaitQueue, cUrl, function(){
						console.log(cUrl + " added to queue");
						pub.publish('crawlers', true);
					});
				}
			});
		},

		getWork : function(callback){
	    	client.rpoplpush(crawlersWaitQueue, crawlersWorkQueue, function(err, cUrl){
				client.get(cUrl, function(err, reply){
					if(reply == 'received'){
			    		callback(cUrl);
					}
				});
	    	});
		}
	},


	subscribe : function(channel, callback){

		sub.on("message", function (iChannel, message) {
			if(iChannel === channel){
				callback(message);
			}
		});

		sub.subscribe(channel);

	},

	unsubscribe : function(channel, callback){
		sub.unsubscribe(channel, callback);
	},

	exists : function(cUrl, callback){
	    client.get(cUrl, function (err, reply) {
	    	callback(reply);
		});
	},

	flush : function(){
		client.flushdb();
	},

};


Object.freeze(wedis);

module.exports = wedis;

