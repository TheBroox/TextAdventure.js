import { IPlayer, IMap } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';
import { ItemsBuilder } from './items.builder';

export class PlayerBuilder {

    private _gameContext: GameContext;
    private _startingLocation: string;
    private _itemsBuilder: ItemsBuilder;
    private _savedPlayer: IPlayer;

    constructor(gameContext: GameContext, savedPlayer?: IPlayer) {
        this._gameContext = gameContext;
        this._itemsBuilder = new ItemsBuilder(this._gameContext, savedPlayer ? savedPlayer.inventory : undefined);
        this._savedPlayer = savedPlayer;
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
            currentLocation: this._savedPlayer ? this._savedPlayer.currentLocation : this._startingLocation,
            inventory: this._itemsBuilder.build(),
            properties: this._savedPlayer ? this._savedPlayer.properties : {}
        };
    }
}
