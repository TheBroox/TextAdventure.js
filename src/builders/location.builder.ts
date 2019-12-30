import { ILocation, ICommand } from '../core/shims/textadventurejs.shim';
import { InteractablesBuilder } from './interactables.builder';
import { ItemsBuilder } from './items.builder';
import { ExitsBuilder } from './exits.builder';

export class LocationBuilder {

    private _displayName: string;
    private _description: string;

    private _interactablesBuilder: InteractablesBuilder;
    private _itemsBuilder: ItemsBuilder;
    private _exitsBuilder: ExitsBuilder;

    private _onSetup: () => void;
    private _onTeardown: () => void;
    private _onCommandExecuted: (command: ICommand) => string;

    constructor() {
        this._interactablesBuilder = new InteractablesBuilder();
        this._itemsBuilder = new ItemsBuilder();
        this._exitsBuilder = new ExitsBuilder();
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

    public onSetup(onSetupFn: () => void): LocationBuilder {
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
        
        return {
            description: this._description,
            firstVisit: true,
            displayName: this._displayName,
            exits: this._exitsBuilder.build(),
            interactables: this._interactablesBuilder.build(),
            items: this._itemsBuilder.build(),
            setup: this._onSetup,
            teardown: this._onTeardown,
            updateLocation: this._onCommandExecuted
        }
    }
}
