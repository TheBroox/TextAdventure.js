import express from 'express';
import path from 'path';
import { ConsoleHttpServer } from '../core/server/http-server';

import * as jahmolxesCartridge from '../cartridges/jahmolxes';
import * as goldMineCartridge from '../cartridges/gold_mine';

const port = parseInt((process.env.PORT || '3000'), 10);
const ipAddress = process.env.IP_ADDRESS || '127.0.0.1';

const server = new ConsoleHttpServer({
    ipAddress: ipAddress,
    port: port
});

server
    .use(express.static(path.join(__dirname, 'static')))
    .registerCartridge('jahmolxes', jahmolxesCartridge)
    .registerCartridge('goldmine', goldMineCartridge)
    .listen();
