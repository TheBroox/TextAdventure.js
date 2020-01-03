import { LocationBuilder } from './location.builder';
import { IMap } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';

export class MapBuilder {

    private _locationBuilders: { [locationName: string]: LocationBuilder } = {};
    private _gameContext: GameContext;
    private _savedMap: IMap;

    constructor(gameContext: GameContext, savedMap?: IMap) {
        this._gameContext = gameContext;
        this._savedMap = savedMap;
    }

    configureLocation(locationName: string, locationConfigurator: (locationBuilder: LocationBuilder) => void): MapBuilder {

        this._locationBuilders[locationName] = this._locationBuilders[locationName] || new LocationBuilder(this._gameContext);

        locationConfigurator(this._locationBuilders[locationName]);

        return this;
    }

    public build(): IMap {
        
        const map: IMap = {};

        Object.keys(this._locationBuilders).forEach(locationName => {

            map[locationName] = this._locationBuilders[locationName].build();
        });

        return map;
    }
}
