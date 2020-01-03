import { MapBuilder } from './map.builder';
import { ICartridge } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';
import { PlayerBuilder } from './player.builder';

export class CartridgeBuilder {

    private _mapBuilder: MapBuilder;
    private _playerBuilder: PlayerBuilder;
    private _introText: string;
    private _outroText: string;
    private _savedCartridge: ICartridge;
    
    public game: ICartridge;

    constructor(savedCartridge?: ICartridge) {
        this._savedCartridge = savedCartridge;
    }

    public configureMap(mapConfigurator: (mapBuilder: MapBuilder) => void): CartridgeBuilder {

        const gameContext = new GameContext(this);

        this._mapBuilder = this._mapBuilder || new MapBuilder(gameContext);

        mapConfigurator(this._mapBuilder);

        return this;
    }

    public configurePlayer(playerConfigurator: (playerBuilder: PlayerBuilder) => void): CartridgeBuilder {
        
        const gameContext = new GameContext(this);

        this._playerBuilder = this._playerBuilder || new PlayerBuilder(gameContext);

        playerConfigurator(this._playerBuilder);

        return this;
    }

    public introText(introText: string): CartridgeBuilder {
        this._introText = introText;
        return this;
    }

    public outroText(outroText: string): CartridgeBuilder {
        this._outroText = outroText;
        return this;
    }

    public build(): ICartridge {
        
        this.game = {
            gameData: {
                commandCounter: 0,
                gameOver: false,
                introText: this._introText,
                outroText: this._outroText,
                player: this._playerBuilder.build(),
                map: this._mapBuilder.build()
            },
            gameActions: {}
        };

        return this.game;
    }
}
