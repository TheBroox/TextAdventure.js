import { GameBuilder } from './game.builder';

export class GameContext {

    private _gameBuilder: GameBuilder;

    constructor(gameBuilder: GameBuilder) {
        this._gameBuilder = gameBuilder;
    }

    public getPlayerProperty(property: string): any {

        return this._gameBuilder.game.gameData.player[property];
    }

    public setPlayerProperty(property: string, value: any): void {

        this._gameBuilder.game.gameData.player[property] = value;
    }

    public spawnExitInLocation(locationName: string, exitName: string): any {

        
    }

    public spawnInteractableInLocation(locationName: string, interactableName: string): any {

    }

    public spawnItemInLocation(locationName: string, itemName: string): any {
        
    }
}
