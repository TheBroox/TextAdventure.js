// === Server Flags ===
var debugMode = false;

// === Initilize Express ===
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session')
var app = express();

// === Import Necessary Functionality ==
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/terminal'));
app.use(session({secret: '1234567890QWERTY', resave: false, saveUninitialized: true}));

// === Start Server ===
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var server = app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

// === Create Console ===
var con = require('./console/console.js');

// // === Open Browser ===
var open = require('open');
open('http://localhost:3000');

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