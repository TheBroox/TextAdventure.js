import { IExitCollection, IExit } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';

export class ExitsBuilder {

    private _gameContext: GameContext;
    private _exitBuilders: { [itemName: string]: ExitBuilder } = {};

    constructor(gameContext: GameContext) {
        this._gameContext = gameContext;
    }

    public add(exitName: string): ExitBuilder {

        this._exitBuilders[exitName] = this._exitBuilders[exitName] || new ExitBuilder(this._gameContext);

        return this._exitBuilders[exitName];
    }

    public build(): IExitCollection {
        
        const exits: IExitCollection = {};

        Object.keys(this._exitBuilders).forEach(exitName => {

            exits[exitName] = this._exitBuilders[exitName].build();
        });

        return exits;
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
