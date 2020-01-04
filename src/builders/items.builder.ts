import { IItemCollection, IItem, IInteractable } from '../core/shims/textadventurejs.shim';
import { GameContext } from './game.context';

export class ItemsBuilder {

    private _gameContext: GameContext;
    private _itemBuilders: { [itemName: string]: ItemBuilder } = {};
    private _savedItems: IItemCollection;

    constructor(gameContext: GameContext, savedItems?: IItemCollection) {
        this._gameContext = gameContext;
        this._savedItems = savedItems;
    }

    public add(itemName: string): ItemBuilder {

        this._itemBuilders[itemName] = this._itemBuilders[itemName] || new ItemBuilder(this._gameContext);

        return this._itemBuilders[itemName];
    }

    public build(): IItemCollection {
        
        const itemBuilders = this._savedItems ? this.createItemBuildersFromSavedItems() : this._itemBuilders;
        const items: IItemCollection = {};

        Object.keys(itemBuilders).forEach(itemName => {
            items[itemName] = itemBuilders[itemName].build();
        });

        return items;
    }

    private createItemBuildersFromSavedItems(): { [itemName: string]: ItemBuilder } {

        const itemBuilders: { [itemName: string]: ItemBuilder } = {};

        Object.keys(this._savedItems).forEach(itemName => {
            itemBuilders[itemName] = new ItemBuilder(this._gameContext, this._savedItems[itemName]);
        });

        return itemBuilders;
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

    private _savedItem: IItem;

    constructor(gameContext: GameContext, savedItem?: IItem) {
        this._gameContext = gameContext;
        this._hidden = false;
        this._quantity = 1;
        this._savedItem = savedItem;
    }

    public displayName(displayName: string): ItemBuilder {
        this._displayName = displayName;
        return this;
    }

    public description(description: string): ItemBuilder {
        this._description = description;
        return this;
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
            description: this._savedItem ? this._savedItem.description : this._description,
            displayName: this._savedItem ? this._savedItem.displayName : this._displayName,
            hidden: this._savedItem ? this._savedItem.hidden : this._hidden,
            quantity: this._savedItem ? this._savedItem.quantity : this._quantity,
            interactions: interactions,
            onTaken: onTaken,
            use: onUse
        };
    }
}
