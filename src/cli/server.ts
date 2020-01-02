const io = require('console-read-write');
const chalk = require('chalk');

import createConsole from '../core/console/console';

import * as necroCartridge from '../cartridges/necro';

const debugEnabled = false;
const devmodeEnabled = true;

async function main() {

  const cons = createConsole({
    debug: debugEnabled
  });

  cons.registerCartridge('necro', necroCartridge);

  io.write('Started CLI server:');

  const gameId = 'console_game';
 
  while (true) {

    const command: string = await io.read();

    if (command === 'exit') {
      io.write('Exiting...');
      break;
    }

    if (devmodeEnabled) {

      const commandComponents = command.split(' ');

      if (commandComponents[0] === 'dev') {

        const componentsAfterDev = commandComponents.slice(1).join(' ');
        const individualCommands = componentsAfterDev.split(';');
  
        for(let i = 0; i < individualCommands.length; i++) {
  
          const individualCommand = individualCommands[i];

          if (!individualCommand) {
            continue;
          }
  
          console.log(chalk.cyanBright(`[DEV]> ${individualCommand}`));
  
          const response = cons.input(individualCommand.trim(), gameId);
  
          console.log(chalk.cyan(response));
        }
  
      } else {
        const response = cons.input(command, gameId);

        console.log(chalk.cyan(response));
      }

    } else {

      const response = cons.input(command, gameId);

      console.log(chalk.cyan(response));
    }    
  }
}
 
main();
