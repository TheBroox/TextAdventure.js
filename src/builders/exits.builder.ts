import { IExitCollection, IExit } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';

export class ExitsBuilder {

    constructor() {

    }

    public build(): IExitCollection {
        return {};
    }
}

export class ExitBuilder {

    private _gameContext: GameContext;

    private _displayName: string;
    private _destination: string;

    constructor(gameContext: GameContext) {
        this._gameContext = gameContext;
    }

    public destination(destination: string): ExitBuilder {
        this._destination = destination;
        return this;
    }

    public displayName(displayName: string): ExitBuilder {
        this._displayName = displayName;
        return this;
    }

    public build(): IExit {

        return {
            destination: this._destination,
            displayName: this._displayName
        };
    }
}
