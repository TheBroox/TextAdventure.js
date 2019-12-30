import { ICartridge } from '../core/shims/textadventurejs.shim';

export class GameContext {

    private _game: ICartridge;

    constructor(game: ICartridge) {
        this._game = game;
    }
}
