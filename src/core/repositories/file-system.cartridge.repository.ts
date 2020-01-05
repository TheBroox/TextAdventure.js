import { ICartridgeRepository } from './cartridge.repository';
import { ICartridge } from '../shims/textadventurejs.shim';
import fs from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

export class FileSystemCartridgeRepository implements ICartridgeRepository {

    private _saveFilePath: string;

    constructor(saveFilePath: string) {
        this._saveFilePath = saveFilePath;
    }

    public async saveCartridgeAsync(cartridge: ICartridge): Promise<void> {

        // do not save map, as it can contain dynamically-added functionality (which needs to be rebuilt everytime)
        const cartridgeToSave: ICartridge = {
            gameData: {
                commandCounter: cartridge.gameData.commandCounter,
                gameOver: cartridge.gameData.gameOver,
                gameID: cartridge.gameData.gameID,
                introText: cartridge.gameData.introText,
                outroText: cartridge.gameData.outroText,
                player: cartridge.gameData.player,
                map: undefined
            },
            gameActions: undefined
        };

        await writeFileAsync(this._saveFilePath, JSON.stringify(cartridgeToSave, null, 4), {
            encoding: 'utf8'
        });
    }

    public async loadCartridgeAsync(): Promise<ICartridge> {

        const saveFileExits = await this.saveFileExistsAsync();

        if (!saveFileExits) {
            return undefined;
        }

        const rawData = await readFileAsync(this._saveFilePath, {
            encoding: 'utf8'
        });

        return <ICartridge>JSON.parse(rawData);
    }

    private async saveFileExistsAsync(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            fs.access(this._saveFilePath, fs.constants.F_OK, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        });
           
    }
}
