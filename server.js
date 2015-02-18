// === Server Flags ===
var debugMode = false;

// === Initilize Express ===
var express = require('express');
var app = express();

// === Import Necessary Functionality ==
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

// === Start Server ===
var server = app.listen(3000, function(){
	console.log('Listening on port %d', server.address().port);
});

// === Create Console ===
var con = require('./console/console.js');

// === Respond to AJAX calls ===
app.post('/console', function(req,res){
	debug(req.body.input);
	res.json({response: con.input(req.body.input, req.session.id)});
});

// === Helper Functions ===
function debug(debugText){
	if(debugMode){
		console.log(debugText);
	}
}