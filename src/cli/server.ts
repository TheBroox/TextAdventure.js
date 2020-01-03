const io = require('console-read-write');
const chalk = require('chalk');

import createConsole, { IConsoleInputResponse } from '../core/console/console';

import necroCartridgeBuilder from '../cartridges/necro';
import { FileSystemCartridgeRepository } from '../core/repositories/file-system.cartridge.repository';
import path from 'path';
const debugEnabled = false;
const devmodeEnabled = true;
const saveFilePath = process.env.NECRO_SAVEFILE || path.join(__dirname, 'savefile.json');

async function main() {

  const repository = new FileSystemCartridgeRepository(saveFilePath);

  const savedCartridge = await repository.loadCartridgeAsync();
  const necroCartridge = necroCartridgeBuilder(savedCartridge);

  const cons = createConsole(necroCartridge, {
    debug: debugEnabled
  });

  logDev('Started CLI server');
  logDev(`Cartridge data will be saved to ${saveFilePath}`);

  console.log(chalk.cyan(cons.getIntroText()));

  while (true) {

    const command: string = await io.read();

    if (command === 'exit') {
      io.write('Exiting...');
      break;
    }

    let response: IConsoleInputResponse;

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
  
          logDev(individualCommand);
  
          response = cons.input(individualCommand.trim());
          console.log(chalk.cyan(response.message));
        }
  
      } else {
        response = cons.input(command);
        console.log(chalk.cyan(response.message));
      }

    } else {

      response = cons.input(command);
      console.log(chalk.cyan(response.message));
    }

    await repository.saveCartridgeAsync(response.cartridge);
  }
}
 
function logDev(message: string) {

  if (devmodeEnabled) {
    console.log(chalk.cyanBright(`[DEV]> ${message}`));
  }
}

main();
