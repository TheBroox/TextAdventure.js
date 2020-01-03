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

        await writeFileAsync(this._saveFilePath, JSON.stringify(cartridge, null, 4), {
            encoding: 'utf8'
        });
    }

    public async loadCartridgeAsync(): Promise<ICartridge> {

        const rawData = await readFileAsync(this._saveFilePath, {
            encoding: 'utf8'
        });

        return <ICartridge>JSON.parse(rawData);
    }
}
