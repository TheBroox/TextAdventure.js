import { ICartridge } from '../shims/textadventurejs.shim';

export interface ICartridgeRepository {
    saveCartridgeAsync(cartridge: ICartridge): Promise<void>;
    loadCartridgeAsync(): Promise<ICartridge>;
}
