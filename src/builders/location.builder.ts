import { ILocation, ICommand } from '../core/shims/textadventurejs.shim';
import { InteractablesBuilder } from './interactables.builder';
import { ItemsBuilder } from './items.builder';
import { ExitsBuilder } from './exits.builder';
import { GameContext } from './game.context';

export class LocationBuilder {

    private _displayName: string;
    private _description: string;

    private _interactablesBuilder: InteractablesBuilder;
    private _itemsBuilder: ItemsBuilder;
    private _exitsBuilder: ExitsBuilder;

    private _onSetup: (gameContext: GameContext) => void;
    private _onTeardown: () => void;
    private _onCommandExecuted: (command: ICommand) => string;

    private _gameContext: GameContext;

    private _savedLocation: ILocation;

    constructor(gameContext: GameContext, savedLocation?: ILocation) {

        this._gameContext = gameContext;
        this._savedLocation = savedLocation;
        
        this._interactablesBuilder = new InteractablesBuilder(this._gameContext, this._savedLocation ? this._savedLocation.interactables : undefined);
        this._itemsBuilder = new ItemsBuilder(this._gameContext, this._savedLocation ? this._savedLocation.items : undefined);
        this._exitsBuilder = new ExitsBuilder(this._gameContext, this._savedLocation ? this._savedLocation.exits : undefined);
    }

    public displayName(displayName: string): LocationBuilder {
        this._displayName = displayName;
        return this;
    }

    public description(description: string): LocationBuilder {
        this._description = description;
        return this;
    }

    public configureInteractables(interactablesConfigurator: (interactablesBuilder: InteractablesBuilder) => void): LocationBuilder {

        interactablesConfigurator(this._interactablesBuilder);

        return this;
    }

    public configureItems(itemsConfigurator: (itemsBuilder: ItemsBuilder) => void): LocationBuilder {
        
        itemsConfigurator(this._itemsBuilder);
        
        return this;
    }

    public configureExits(exitsConfigurator: (exitsBuilder: ExitsBuilder) => void): LocationBuilder {
        
        exitsConfigurator(this._exitsBuilder);

        return this;
    }

    public onSetup(onSetupFn: (gameContext: GameContext) => void): LocationBuilder {
        this._onSetup = onSetupFn;
        return this;
    }

    public onTeardown(onTeardownFn: () => void): LocationBuilder {
        this._onTeardown = onTeardownFn;
        return this;
    }

    public onCommandExecuted(onCommandExecutedFn: (command: ICommand) => string): LocationBuilder {
        this._onCommandExecuted = onCommandExecutedFn;
        return this;
    }

    public build(): ILocation {
        
        const onSetup = () => {
            if (typeof this._onSetup === 'function') {
                this._onSetup(this._gameContext);
            }
        };

        return {
            description: this._savedLocation ? this._savedLocation.description : this._description,
            firstVisit: this._savedLocation ? this._savedLocation.firstVisit : true,
            displayName: this._savedLocation ? this._savedLocation.displayName : this._displayName,
            exits: this._exitsBuilder.build(),
            interactables: this._interactablesBuilder.build(),
            items: this._itemsBuilder.build(),
            setup: onSetup,
            teardown: this._onTeardown,
            updateLocation: this._onCommandExecuted
        }
    }
}
