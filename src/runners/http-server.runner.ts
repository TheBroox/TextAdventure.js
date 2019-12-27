import express from 'express';
import path from 'path';
import { ConsoleHttpServer } from '../server/http-server';

import * as jahmolxesCartridge from '../cartridges/jahmolxes';
import * as goldMineCartridge from '../cartridges/gold_mine';

const server = new ConsoleHttpServer();

server
    .use(express.static(path.resolve(path.join(__dirname, '..', 'terminal'))))
    .registerCartridge('jahmolxes', jahmolxesCartridge)
    .registerCartridge('goldmine', goldMineCartridge)
    .listen();
