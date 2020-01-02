import { IItemCollection, IItem, IInteractable } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';

export class ItemsBuilder {

    private _gameContext: GameContext;
    private _itemBuilders: { [itemName: string]: ItemBuilder } = {};

    constructor(gameContext: GameContext) {
        this._gameContext = gameContext;
    }

    public add(itemName: string): ItemBuilder {

        this._itemBuilders[itemName] = this._itemBuilders[itemName] || new ItemBuilder(this._gameContext);

        return this._itemBuilders[itemName];
    }

    public build(): IItemCollection {
        
        const items: IItemCollection = {};

        Object.keys(this._itemBuilders).forEach(itemName => {

            items[itemName] = this._itemBuilders[itemName].build();
        });

        return items;
    }
}

export class ItemBuilder {

    private _gameContext: GameContext;
    private _interactionsMap: { [interactionName: string]: (gameContext: GameContext) => string } = {};

    private _onTaken: (gameContext: GameContext) => void;
    private _onUse: (gameContext: GameContext, object: string) => string;

    private _quantity: number;
    private _displayName: string;
    private _description: string;
    private _hidden: boolean;

    constructor(gameContext: GameContext) {
        this._gameContext = gameContext;
        this._hidden = false;
        this._quantity = 1;
    }

    public quantity(quantity: number): ItemBuilder {

        this._quantity = quantity;

        return this;
    }

    public hidden(isHidden: boolean = true): ItemBuilder {

        this._hidden = isHidden;

        return this;
    }

    public on(interactionName: string, interactionFn: (gameContext: GameContext) => string): ItemBuilder {

        this._interactionsMap[interactionName] = interactionFn;

        return this;
    }

    public onTaken(onTakenFn: (gameContext: GameContext) => void): ItemBuilder {

        this._onTaken = onTakenFn;

        return this;
    }

    public onUse(onUseFn: (gameContext: GameContext, object: string) => string): ItemBuilder {

        this._onUse = onUseFn;

        return this;
    }

    public build(): IItem {

        const interactions: IInteractable = {};

        Object.keys(this._interactionsMap).forEach(interactionName => {
            interactions[interactionName] = () => {
                return this._interactionsMap[interactionName](this._gameContext);
            }
        });

        const onTaken = () => {
            if (typeof this._onTaken === 'function') {
                this._onTaken(this._gameContext);
            }
        }

        const onUse = (object: string) => {
            if (typeof this._onUse === 'function') {
                return this._onUse(this._gameContext, object);
            }
        }

        return {
            description: this._description,
            displayName: this._displayName,
            hidden: this._hidden,
            quantity: this._quantity,
            interactions: interactions,
            onTaken: onTaken,
            use: onUse
        };
    }
}
