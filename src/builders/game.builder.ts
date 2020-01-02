import { MapBuilder } from './map.builder';
import { ICartridge } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';

export class GameBuilder {

    private _mapBuilder: MapBuilder;
    
    public game: ICartridge;

    constructor() {
        
    }

    public configureMap(mapConfigurator: (mapBuilder: MapBuilder) => void): GameBuilder {

        const gameContext = new GameContext(this);

        this._mapBuilder = this._mapBuilder || new MapBuilder(gameContext);

        mapConfigurator(this._mapBuilder);

        return this;
    }

    public build(): ICartridge {
        
        this.game = {
            gameData: {
                commandCounter: 0,
                gameOver: false,
                introText: '',
                outroText: '',
                player: {
                    currentLocation: '',
                    inventory: {}
                },
                map: this._mapBuilder.build()
            },
            gameActions: {}
        };

        return this.game;
    }
}
