import { IExitCollection, IExit } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';

export class ExitsBuilder {

    private _gameContext: GameContext;
    private _exitBuilders: { [exitName: string]: ExitBuilder } = {};
    private _savedExits: IExitCollection;

    constructor(gameContext: GameContext, savedExits?: IExitCollection) {
        this._gameContext = gameContext;
        this._savedExits = savedExits;
    }

    public add(exitName: string): ExitBuilder {

        this._exitBuilders[exitName] = this._exitBuilders[exitName] || new ExitBuilder(this._gameContext);

        return this._exitBuilders[exitName];
    }

    public build(): IExitCollection {
        
        const exitBuilders = this._savedExits ? this.createExitBuildersFromSavedExits() : this._exitBuilders;
        const exits: IExitCollection = {};

        Object.keys(exitBuilders).forEach(exitName => {
            exits[exitName] = exitBuilders[exitName].build();
        });

        return exits;
    }

    private createExitBuildersFromSavedExits(): { [exitName: string]: ExitBuilder } {

        const exitBuilders: { [exitName: string]: ExitBuilder } = {};

        Object.keys(this._savedExits).forEach(exitName => {
            exitBuilders[exitName] = new ExitBuilder(this._gameContext, this._savedExits[exitName]);
        });

        return exitBuilders;
    }
}

export class ExitBuilder {

    private _gameContext: GameContext;

    private _displayName: string;
    private _destination: string;

    private _savedExit: IExit;

    constructor(gameContext: GameContext, savedExit?: IExit) {
        this._gameContext = gameContext;
        this._savedExit = savedExit;
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
            destination: this._savedExit ? this._savedExit.destination : this._destination,
            displayName: this._savedExit ? this._savedExit.displayName : this._displayName
        };
    }
}
