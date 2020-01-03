import { IInteractableCollction, IInteractable } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';

export class InteractablesBuilder {

    private _interactableBuilders: { [interactableName: string]: InteractableBuilder } = {};
    private _gameContext: GameContext;
    private _savedInteractables: IInteractableCollction;

    constructor(gameContext: GameContext, savedInteractables?: IInteractableCollction) {
        this._gameContext = gameContext;
        this._savedInteractables = savedInteractables;
    }

    public add(interactableName: string): InteractableBuilder {

        this._interactableBuilders[interactableName] = this._interactableBuilders[interactableName] || new InteractableBuilder(this._gameContext);

        return this._interactableBuilders[interactableName];
    }

    public build(): IInteractableCollction {
        
        const interactableBuilders = this._savedInteractables ? this.createInteractableBuildersFromSavedInteractables() : this._interactableBuilders;
        const interactables: IInteractableCollction = {};

        Object.keys(interactableBuilders).forEach(interactableName => {

            interactables[interactableName] = interactableBuilders[interactableName].build();
        });

        return interactables;
    }

    private createInteractableBuildersFromSavedInteractables(): { [interactableName: string]: InteractableBuilder } {

        const interactableBuilders: { [interactableName: string]: InteractableBuilder } = {};

        Object.keys(this._savedInteractables).forEach(interactableName => {
            interactableBuilders[interactableName] = new InteractableBuilder(this._gameContext, this._savedInteractables[interactableName]);
        });

        return interactableBuilders;
    }
}

export class InteractableBuilder {

    private _interactionsMap: { [interactionName: string]: (gameContext: GameContext) => string } = {};
    private _gameContext: GameContext;
    private _savedInteractable: IInteractable;

    constructor(gameContext: GameContext, savedInteractable?: IInteractable) {
        this._gameContext = gameContext;
        this._savedInteractable = savedInteractable;
    }

    public on(interactionName: string, interactionFn: (gameContext: GameContext) => string): InteractableBuilder {

        this._interactionsMap[interactionName] = interactionFn;

        return this;
    }

    public build(): IInteractable {

        if (this._savedInteractable) {
            return this._savedInteractable;
        }

        const interactable: IInteractable = {};

        Object.keys(this._interactionsMap).forEach(interactionName => {
            interactable[interactionName] = () => {
                return this._interactionsMap[interactionName](this._gameContext);
            }
        })

        return interactable;
    }
}
