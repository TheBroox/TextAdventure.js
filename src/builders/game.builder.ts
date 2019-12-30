import { MapBuilder } from './map.builder';
import { ICartridge } from '../core/shims/textadventurejs.shim';

export class GameBuilder {

    private _mapBuilder: MapBuilder;

    constructor() {
        
    }

    public configureMap(mapConfigurator: (mapBuilder: MapBuilder) => void): GameBuilder {

        this._mapBuilder = this._mapBuilder || new MapBuilder();

        mapConfigurator(this._mapBuilder);

        return this;
    }

    public build(): ICartridge {

    }
}
