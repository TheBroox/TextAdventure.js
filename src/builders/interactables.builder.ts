import { IInteractableCollction, IInteractable } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';

export class InteractablesBuilder {

    private _interactableBuilders: { [interactableName: string]: InteractableBuilder } = {};

    constructor() {

    }

    public add(interactableName: string): InteractableBuilder {

        this._interactableBuilders[interactableName] = this._interactableBuilders[interactableName] || new InteractableBuilder();

        return this._interactableBuilders[interactableName];
    }

    public build(): IInteractableCollction {
        
        const interactables: IInteractableCollction = {};

        Object.keys(this._interactableBuilders).forEach(interactableName => {

            interactables[interactableName] = this._interactableBuilders[interactableName].build();
        });

        return interactables;
    }
}

export class InteractableBuilder {

    private _interactionsMap: { [interactionName: string]: (gameContext: GameContext) => string } = {};
    private _gameContext: GameContext;

    constructor(gameContext: GameContext) {
        this._gameContext = gameContext;
    }

    public on(interactionName: string, interactionFn: (gameContext: GameContext) => string): InteractableBuilder {

        this._interactionsMap[interactionName] = interactionFn;

        return this;
    }

    public build(): IInteractable {

        const interactable: IInteractable = {};

        Object.keys(this._interactionsMap).forEach(interactionName => {
            interactable[interactionName] = () => {
                return this._interactionsMap[interactionName](this._gameContext);
            }
        })

        return interactable;
    }
}