const io = require('console-read-write');
const chalk = require('chalk');

import createConsole, { IConsoleInputResponse } from '../core/console/console';

import necroCartridgeFactory from '../cartridges/necro';
import { FileSystemCartridgeRepository } from '../core/repositories/file-system.cartridge.repository';
import path from 'path';
import { CartridgeBuilder } from '../builders/cartridge.builder';

const debugEnabled = process.env.NECRO_DEBUG ? (process.env.NECRO_DEBUG.toLowerCase() === 'true') : false;
const devmodeEnabled = process.env.NECRO_DEVMODE ? (process.env.NECRO_DEVMODE.toLowerCase() === 'true') : false;
const saveFilePath = process.env.NECRO_SAVEFILE || path.join(__dirname, 'savefile.json');

async function main() {

  const repository = new FileSystemCartridgeRepository(saveFilePath);

  const savedCartridge = await repository.loadCartridgeAsync();
  const cartridgeBuilder = new CartridgeBuilder(savedCartridge);
  const necroCartridge = necroCartridgeFactory(cartridgeBuilder);

  const cons = createConsole(necroCartridge, {
    onDebugLog: logDebug
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

function logDebug(message: string) {

  if (debugEnabled) {
    console.log(chalk.cyanBright(`    [DEBUG]> ${message}`));
  }
}

main();
