export interface ICartridge {
    gameData: IGameData;
    gameActions: IGameActions;
}

export interface IGameData {
    commandCounter: number;
	gameOver: boolean;
	introText: string;
	outroText: string;
	player: IPlayer;
	map : IMap;
}

export interface IPlayer {
    currentLocation: string;
    inventory: IItemCollection;
    [otherProps: string]: any;
}

export interface IMap {
    [locationName: string]: ILocation;
}

export interface ILocation {
    firstVisit: boolean;
    description: string;
    displayName?: string;
    items?: IItemCollection;
    interactables?: IInteractableCollction;
    exits?: IExitCollection;

    setup?: (...args: any[]) => void;
    teardown?: (...args: any[]) => void;
    updateLocation?: (...args: any[]) => string;
}

export interface IItemCollection { [itemName: string]: IItem };
export interface IInteractableCollction { [interactableName: string]: IInteractable; };
export interface IExitCollection { [exitName: string]: IExit; };

export interface IItem {
    description: string;
    displayName: string;
    hidden: boolean;
    quantity: number;
    use?: (...args: any[]) => string;
    interactions?: { [interactionName: string]: string; };
}

export interface IInteractable {
    [interactionName: string]: string | (() => string)
}

export interface IExit {
    displayName: string;
    destination: string;
}

export interface IGameActions {
    [actionName: string]: (game: ICartridge, command: ICommand, consoleInterface: (game :ICartridge, command: ICommand) => IGameActionResult) => IGameActionResult;
}

export interface IGameActionResult {

}

export interface ICommand {
    action: any;
    subject: any;
    object: any;
}
