import { CartridgeBuilder } from './cartridge.builder';
import { LocationBuilder } from './location.builder';
import { ExitBuilder } from './exits.builder';
import { InteractableBuilder } from './interactables.builder';
import { ILocation } from '../core/shims/textadventurejs.shim';
import { ItemBuilder } from './items.builder';

export class GameContext {

    private _gameBuilder: CartridgeBuilder;

    constructor(gameBuilder: CartridgeBuilder) {
        this._gameBuilder = gameBuilder;
    }

    public getPlayerProperty(property: string): any {

        return this._gameBuilder.game.gameData.player.properties[property];
    }

    public setPlayerProperty(property: string, value: any): void {

        this._gameBuilder.game.gameData.player.properties[property] = value;
    }

    public spawnExitInLocation(locationName: string, exitName: string, exitConfigurator: (exitBuilder: ExitBuilder) => void): void {

        const exitBuilder = new ExitBuilder(this);

        const location = this.getLocation(locationName);

        location.exits = location.exits || {};

        exitConfigurator(exitBuilder);

        location.exits[exitName] = exitBuilder.build();
    }

    public spawnInteractableInLocation(locationName: string, interactableName: string, interactableConfigurator: (interactableBuilder: InteractableBuilder) => void): void {

        const interactableBuilder = new InteractableBuilder(this);

        const location = this.getLocation(locationName);

        location.interactables = location.interactables || {};

        interactableConfigurator(interactableBuilder);

        location.interactables[interactableName] = interactableBuilder.build();
    }

    public spawnItemInLocation(locationName: string, itemName: string, itemConfigurator: (itemBuilder: ItemBuilder) => void): void {
        
        const itemBuilder = new ItemBuilder(this);

        const location = this.getLocation(locationName);

        location.items = location.items || {};

        itemConfigurator(itemBuilder);

        location.items[itemName] = itemBuilder.build();
    }

    public setGameOver(endText?: string): void {

        this._gameBuilder.game.gameData.gameOver = true;

        if (endText) {
            this._gameBuilder.game.gameData.outroText = endText;
        }
    }

    private getLocation(locationName: string): ILocation {

        const location = this._gameBuilder.game.gameData.map[locationName];

        if (!location) {
            throw new LocationNotFoundError(`Location '${locationName}' does not exist`);
        }

        return location;
    }
}

export class LocationNotFoundError extends Error {

    constructor(message: string) {
        super(message);
    }
}