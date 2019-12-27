const io = require('console-read-write');
import createConsole from '../core/console/console';

import * as jahmolxesCartridge from '../cartridges/jahmolxes';
import * as goldMineCartridge from '../cartridges/gold_mine';

async function main() {

  const cons = createConsole();

  cons.registerCartridge('jahmolxes', jahmolxesCartridge);
  cons.registerCartridge('goldmine', goldMineCartridge);

  io.write('Started CLI server:');

  const gameId = 'console_game';
 
  while (true) {

    const command = await io.read();

    if (command === 'exit') {
      io.write('Exiting...');
      break;
    }

    const response = cons.input(command, gameId);

    io.write(response);
  }
}
 
main();
