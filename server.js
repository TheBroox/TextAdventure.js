// Initilize Express
var express = require('express');
var app = express();

// Start server
var server = app.listen(3000, function(){
	console.log('Listening on port %d', server.address().port);
});

// Create Console
var con = require('./console/console.js');

// Import necessary functionality
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

// Respond to AJAX calls
app.post('/',function(req,res){
	console.log(req.body.input);
	res.json({response: con.input(req.body.input)});
});