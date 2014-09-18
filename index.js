// playing with spark core
//
// set spark token in environment variable SPARKCORETESTTOKEN=798347687326482374230987421

var _    = require('lodash'),
	wait = require('wait.for'),
	express = require('express'),
	spark = require('spark');
	
var app = express();


var token = process.env.SPARKCORETESTTOKEN;

if (!token) {
	console.log("Please set environment variable SPARKCORETESTTOKEN");
	process.exit(1);
}

wait.launchFiber(main);
// at this point, control is transferred to main


function main() {
	wait.for(spark.login.bind(spark), {accessToken: token});
	
	var mysparks = wait.for(spark.listDevices.bind(spark));
	
	console.log(mysparks);
	
	var server = app.listen(3000);
	
	app.get('/', function(req, res) {
		res.render('home.jade', {mysparks: mysparks});
	});
	
	app.get('/blinky/:id/:onoff', function(req, res) {
		var core = _.find(spark.devices, {id:req.param('id')});
		if (core) {
			if (req.param('onoff')=='on') core.call('digitalwrite', 'D7:HIGH', console.log);
			else core.call('digitalwrite', 'D7:LOW', console.log);
		}
		res.redirect('/');
	});
}