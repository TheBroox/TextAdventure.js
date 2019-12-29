const io = require('console-read-write');
const chalk = require('chalk');

import createConsole from '../core/console/console';

import * as jahmolxesCartridge from '../cartridges/jahmolxes';
import * as goldMineCartridge from '../cartridges/gold_mine';
import * as necromancerCartridge from '../cartridges/necromancer';

async function main() {

  const cons = createConsole({
    debug: true
  });

  cons.registerCartridge('jahmolxes', jahmolxesCartridge);
  cons.registerCartridge('goldmine', goldMineCartridge);
  cons.registerCartridge('necromancer', necromancerCartridge);

  io.write('Started CLI server:');

  const gameId = 'console_game';
 
  while (true) {

    const command = await io.read();

    if (command === 'exit') {
      io.write('Exiting...');
      break;
    }

    const response = cons.input(command, gameId);

    console.log(chalk.cyan(response));
  }
}
 
main();
