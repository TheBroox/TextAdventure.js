import express from 'express';

import bodyParser from 'body-parser';
import session from 'express-session';
import createConsole from '../console/console';
import path from 'path';

import * as jahmolxesCartridge from '../cartridges/jahmolxes';
import * as goldMineCartridge from '../cartridges/gold_mine';

const server_port = process.env.OPENSHIFT_NODEJS_PORT || '3000';
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(path.join(__dirname, '..', 'terminal'))));
app.use(session({secret: '1234567890QWERTY', resave: false, saveUninitialized: true}));

const con = createConsole();

con.registerCartridge('gold_mine', goldMineCartridge);
con.registerCartridge('jahmolxes', jahmolxesCartridge);

app.listen(parseInt(server_port, 10), server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});

app.post('/console', function(req,res) {
	res.json({response: con.input(req.body.input, req.session.id)});
});
