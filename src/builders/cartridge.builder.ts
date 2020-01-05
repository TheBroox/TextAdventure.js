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

        const savedMap = this._savedCartridge ? this._savedCartridge.gameData.map : undefined;

        this._mapBuilder = this._mapBuilder || new MapBuilder(gameContext, savedMap);

        mapConfigurator(this._mapBuilder);

        return this;
    }

    public configurePlayer(playerConfigurator: (playerBuilder: PlayerBuilder) => void): CartridgeBuilder {
        
        const gameContext = new GameContext(this);

        const savedPlayer = this._savedCartridge ? this._savedCartridge.gameData.player : undefined;

        this._playerBuilder = this._playerBuilder || new PlayerBuilder(gameContext, savedPlayer);

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
        
        const savedGameData = this._savedCartridge ? this._savedCartridge.gameData : undefined;

        this.game = {
            gameData: {
                commandCounter: savedGameData ? savedGameData.commandCounter : 0,
                gameOver: savedGameData ? savedGameData.gameOver : false,
                introText: savedGameData ? savedGameData.introText : this._introText,
                outroText: savedGameData ? savedGameData.outroText : this._outroText,
                player: this._playerBuilder.build(),
                map: this._mapBuilder.build()
            },
            gameActions: {}
        };

        return this.game;
    }
}
