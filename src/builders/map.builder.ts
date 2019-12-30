import { LocationBuilder } from './location.builder';
import { IMap } from '../core/shims/textadventurejs.shim';

export class MapBuilder {

    private _locationBuilders: { [locationName: string]: LocationBuilder } = {};

    constructor() {

    }

    configureLocation(locationName: string, locationConfigurator: (locationBuilder: LocationBuilder) => void): MapBuilder {

        this._locationBuilders[locationName] = this._locationBuilders[locationName] || new LocationBuilder();

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
