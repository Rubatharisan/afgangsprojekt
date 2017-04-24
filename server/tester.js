var wedis = require('./lib/wedis');

wedis.flush();
wedis.addToQueue('http://bloomit.dk.bluebird.pw');

// var url  = "http://bloomit.dk.bluebird.pw/afmeld-nyhedsbrev-1-e";
// wedis.exists(url, function(e){
// 	console.log(typeof e);

// 	if(e == "inqueue"){
// 		console.log("Yup inqueue");
// 	}

// 	if(e == undefined){
// 		console.log("Never here");
// 	}
// })