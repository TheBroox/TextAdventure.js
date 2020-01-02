import { IPlayer } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';
import { ItemsBuilder } from './items.builder';

export class PlayerBuilder {

    private _gameContext: GameContext;
    private _startingLocation: string;
    private _itemsBuilder: ItemsBuilder;

    constructor(gameContext: GameContext) {
        this._gameContext = gameContext;
        this._itemsBuilder = new ItemsBuilder(this._gameContext);
    }

    public startingLocation(locationName: string): PlayerBuilder {
        this._startingLocation = locationName;
        return this;
    }

    public configureItems(itemsConfigurator: (itemsBuilder: ItemsBuilder) => void): PlayerBuilder {
        
        itemsConfigurator(this._itemsBuilder);

        return this;
    }

    public build(): IPlayer {

        return {
            currentLocation: this._startingLocation,
            inventory: this._itemsBuilder.build()
        };
    }
}
