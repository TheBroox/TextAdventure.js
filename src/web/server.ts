import express from 'express';
import path from 'path';
import { ConsoleHttpServer } from '../core/server/http-server';

import necroCartridgeBuilder from '../cartridges/necro';

const port = parseInt((process.env.PORT || '3000'), 10);
const ipAddress = process.env.IP_ADDRESS || '127.0.0.1';

const necroCartridge = necroCartridgeBuilder();

const server = new ConsoleHttpServer(necroCartridge, {
    ipAddress: ipAddress,
    port: port
});

server
    .use(express.static(path.join(__dirname, 'static')))
    .listen();
