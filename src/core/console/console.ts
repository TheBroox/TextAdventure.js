import { DefaultParser } from './default.parser';
import { IParser } from './parser';
import { ICartridge, IGameData, IGameActions, ILocation, IGameActionResult, ICommand, DefaultConsoleActons } from '../shims/textadventurejs.shim';

export interface IConsoleOptions {
	debug?: boolean;
}

export interface IConsole {
	input(input: string, gameID: string): string;
	registerCartridge(name: string, cartridgeDefinition: ICartridge): void;
}

export default function createConsole(options?: IConsoleOptions, parser?: IParser): IConsole {

	parser = parser || new DefaultParser();
	options = options || {};

	var games: { [gameId: string]: ICartridge } = {};
	var availableCartridges: any = {};

	// ----------------------------\
	// === Main Function ==================================================================================================
	// ----------------------------/
	function input(input: string, gameID: string) {

		const command = parser.parse(input);
		const cartridge = games[gameID];

		if(cartridge) {

			const gameActions = cartridge.gameActions;
			const game = cartridge.gameData;

			++game.commandCounter;

			let returnString;

			debug(gameID + ': ' + game.commandCounter);

			if (isActionDefinedInCartridge(gameActions, command.action)) {

				debug(`Running cartridge action '${command.action}'`);
				returnString = gameActions[command.action](game, command, consoleInterface);

			} else if (isActionDefinedInConsole(actions, command.action)) {

				debug(`Running console action '${command.action}'`);
				returnString = actions[command.action](game, command).message;

			} else if (canInteractWithSubjectInCurrentLocation(game, command.action, command.subject)) {

				debug(`Performing interaction '${command.action}' in current location on subject ${command.subject}`);
				returnString = interactWithSubjectInCurrentLocation(game, command.action, command.subject);
			}

			returnString = returnString || 'I don\'t know how to do that';

			const currentLocation = getCurrentLocation(game);

			if (typeof currentLocation.updateLocation === 'function') {

				const updateLocationString = currentLocation.updateLocation(command);

				if (updateLocationString) {
					returnString = updateLocationString;
				}
			}

			return checkForGameEnd(game, returnString);

		} else {

			debug(gameID + ': no game');

			if(command.action === 'load') {
				return loadCartridge(gameID, command.subject);
			} else {
				return listCartridges();
			}
		}
	};

	// ----------------------------\
	// === Game Setup Functions ===========================================================================================
	// ----------------------------/
	function registerCartridge(name: any, cartridgeDefinition: any) {
		availableCartridges[name] = cartridgeDefinition;
	}

	function listCartridges(){
		var cartridges = Object.keys(availableCartridges);
		if (cartridges.length === 0){
			return 'No game cartridges found.'
		}
		var cartridgesFormated = 'Available Games: \n';
		for(var i = 0; i < cartridges.length; i++){
			cartridgesFormated = cartridgesFormated.concat(cartridges[i]);
			if(i < cartridges.length-1){
				cartridgesFormated = cartridgesFormated.concat('\n');
			}
		}
		return cartridgesFormated;
	}

	function loadCartridge(gameID: any, gameName: any){
		if (!gameName){
			return "Specify game cartridge to load.";
		}
		if (!availableCartridges[gameName]) {
			return `Cartridge ${gameName} not found.`;
		}
		
		var file = availableCartridges[gameName];

		games[gameID] = {gameData: file.gameData, gameActions: file.gameActions};
		games[gameID].gameData.gameID = gameID;
		return games[gameID].gameData.introText + '\n' + getLocationDescription(games[gameID].gameData);
	}

	// ----------------------------\
	// === Console Actions =================================================================================================
	// ----------------------------/
	var actions: any = {

		die : function(game: IGameData, command: ICommand){

			delete games[game.gameID];

			return { message:'You are dead', success: true };
		},

		drop: function(game: IGameData, command: ICommand) {

			if(!command.subject) {
				return { message: 'What do you want to drop?', success: false };
			}

			if (canInteractWithSubjectInCurrentLocation(game, DefaultConsoleActons.drop, command.subject)) {
				return { message: interactWithSubjectInCurrentLocation(game, DefaultConsoleActons.drop, command.subject), success: true };
			}

			if (isItemInPlayerInventory(game, command.subject)) {

				const currentLocation = getCurrentLocation(game);

				moveItem(command.subject, game.player.inventory, currentLocation.items);

				const item = getItem(currentLocation.items, command.subject);

				item.hidden = false;

				return { message: `Dropped ${command.subject}`, success: true };
			}

			return { message: `You do not have a ${command.subject} to drop`, success: false };
		},

		go: function(game: IGameData, command: ICommand): IGameActionResult {

			if(!command.subject) {
				return {message: 'Where do you want to go?', success: false};
			}

			const currentLocation = getCurrentLocation(game);
			const exits = currentLocation.exits;

			let playerDestination = null;

			if (!exits) {
				return { message: 'You can\'t go anywhere from this location.', success: false };
			}

			const matchingExitName = Object.keys(exits)
				.find(exitName => exits[exitName].displayName && exits[exitName].displayName.toLowerCase() === command.subject.toLowerCase());

			const matchingExit = exits[matchingExitName];

			if (matchingExit) {
				playerDestination = matchingExit.destination;
			}

			if(playerDestination === null) {
				return {message: `Unknown location '${command.subject}'.`, success: false};
			}

			currentLocation.firstVisit = false;

			if (typeof currentLocation.teardown === 'function') {
				currentLocation.teardown();
			}

			if (typeof game.map[playerDestination].setup === 'function') {
				game.map[playerDestination].setup();
			}

			game.player.currentLocation = playerDestination;

			return { message: getLocationDescription(game), success: true };
		},

		inventory : function(game: any, command: any){
			var inventoryList = 'Your inventory contains:';
			for (var item in game.player.inventory){
				var itemObject = game.player.inventory[item];
				var itemName = itemObject.displayName;
				if(itemObject.quantity > 1){
					itemName = itemName.concat(' x'+itemObject.quantity);
				}
				inventoryList = inventoryList.concat('\n'+itemName);
			}
			if (inventoryList === 'Your inventory contains:'){
				return {message: 'Your inventory is empty.', success: true};
			} else {
				return {message: inventoryList, success: true};
			}
		},

		look : function(game: any, command: any) {

			if(!command.subject){
				return {message: getLocationDescription(game, true), success: true};
			}

			var isInventoryItem = !!(game.player.inventory[command.subject]);

			if (isInventoryItem) {
				debug(`Subject ${command.subject} is an item in the player inventory`);
				return {message: getItem(game.player.inventory, command.subject).description, success: true};
			}

			var isCurrentLocationItem = !!(getCurrentLocation(game).items[command.subject]);

			if (isCurrentLocationItem) {
				debug(`Subject ${command.subject} is an item in the current location`);
				return {message: getItem(getCurrentLocation(game).items, command.subject).description, success: true};
			}

			var interactionMessage = undefined;

			try {
				interactionMessage = interactWithSubjectInCurrentLocation(game, 'look', command.subject);
			} catch (e) {
				debug(`Interaction error: ${e}`);
			}

			if (!interactionMessage) {
				debug(`No interaction message specified for command 'look' and subject '${command.subject}'`);
				return { message: 'There is nothing important about the '+ command.subject+ '.', success: false };
			}

			return { message: interactionMessage, success: true };
		},

		take : function(game: any, command: any) {
			if(!command.subject){
				return {message: 'What do you want to take?', success: false};
			}
			try{
				return {message: interactWithSubjectInCurrentLocation(game, 'take', command.subject), success: true};
			} catch(error) {
				debug(`Take: interact error: ${error}`);
				try {
					moveItem(command.subject, getCurrentLocation(game).items, game.player.inventory);
					return {message: command.subject + ' taken', success: true};
				} catch(error2){
					debug(`Take: moveItem error: ${error2}`);
					return {message: 'Best just to leave the ' + command.subject + ' as it is.', success: false};
				}
			}
		},

		use : function(game: any, command: any){
			if(!command.subject){
				return {message: 'What would you like to use?', success: false};
			}
			try {
				return {message: getItem(game.player.inventory, command.subject).use(), success: true};
			} catch (itemNotInInventoryError) {
				return {message: 'Can\'t do that.', success: false};
			}
		}
	};


	// ----------------------------\
	// === Helper Functions ===============================================================================================
	// ----------------------------/
	function checkForGameEnd(game: any, returnString: any){
		if(game.gameOver){
		returnString = returnString + '\n' + game.outroText;
			actions.die(game,{action:'die'});
		} 
		return returnString;
	}

	function clone(obj: any) {
		if(obj == null || typeof(obj) != 'object'){
			return obj;
		}
		var temp = obj.constructor();
		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				temp[key] = clone(obj[key]);
			}
		}
		return temp;
	}

	function consoleInterface(game: any, command: any){
		return actions[command.action](game, command);
	}

	function debug(debugText: any){
		if(options.debug){
			console.log(`[DEBUG] ${debugText}`);
		}
	}

	function exitsToString(exitsObject: any){
		var numOfExits = Object.keys(exitsObject).length;
		if(numOfExits === 0){
			return '';
		}
		var visibleExits = [];
		for(var exit in exitsObject){
			var exitObject = exitsObject[exit];
			if(!exitObject.hidden){
				visibleExits.push(exitObject.displayName);
			}
		}
		switch(visibleExits.length){
			case 0:
				return '';
			case 	1:
				var returnString = ' Exit is ';
				break;
			default :
				var returnString = ' Exits are ';
		}
		for(var i=0; i<visibleExits.length; ++i){
			returnString = returnString.concat(visibleExits[i]);
			if(i === visibleExits.length-2){
				returnString = returnString.concat(' and ');
			} else if (i === visibleExits.length-1){
				returnString = returnString.concat('.');
			} else {
				returnString = returnString.concat(', ');
			}
		}
		return returnString;
	}

	function getCurrentLocation(gameData: IGameData): ILocation {
		return gameData.map[gameData.player.currentLocation];
	}

	function getLocationDescription(game: any, forcedLongDescription?: any){
		var currentLocation = getCurrentLocation(game);
		var description;
		if(currentLocation.firstVisit || forcedLongDescription){
			description = currentLocation.description;
			if(currentLocation.items){
				description = description.concat(itemsToString(currentLocation.items));
			}
			if(currentLocation.exits){
				description = description.concat(exitsToString(currentLocation.exits));
			}
		} else {
			description = currentLocation.displayName;
		}
		return description;
	}

	function getItem(itemLocation: any, itemName: any){
		return itemLocation[getItemName(itemLocation, itemName)];
	}

	function getItemName(itemLocation: any, itemName: any){
		if(itemLocation[itemName] !== undefined) {
			return itemName;
		} else {
			for(var item in itemLocation){
				if(itemLocation[item].displayName.toLowerCase() === itemName){
					return item;
				}
			}
		}
	}

	function itemsToString(itemsObject: any){
		var numOfItems = Object.keys(itemsObject).length;
		if(numOfItems === 0){
			return '';
		}
		var visibleItems = [];
		for(var item in itemsObject){
			var itemObject = itemsObject[item];
			if(!itemObject.hidden){
				visibleItems.push({name:itemObject.displayName, quantity:itemObject.quantity});
			}
		}
		if(visibleItems.length === 0){
			return '';
		}
		if(visibleItems[0].quantity === 1){
			var returnString = ' There is ';
		} else {
			var returnString = ' There are ';
		}
		for(var i=0; i<visibleItems.length; ++i){
			if(visibleItems[i].quantity > 1){
				returnString = returnString.concat(visibleItems[i].quantity+' '+visibleItems[i].name+'s');
			} else {
				returnString = returnString.concat('a '+visibleItems[i].name);
			}
			if(i === visibleItems.length-2){
				returnString = returnString.concat(' and ');
			} else if (i === visibleItems.length-1){
				returnString = returnString.concat(' here.');
			} else {
				returnString = returnString.concat(', ');
			}
		}
		return returnString;
	}

	function interactWithSubjectInCurrentLocation(game: any, interaction: any, subject: any) {

		var currentLocation = getCurrentLocation(game);
		var itemsForCurrentLocation = currentLocation.items;
		var interactablesForCurrentLocation = currentLocation.interactables;

		var subjectIsItem = !!(itemsForCurrentLocation[subject]);
		var subjectIsInteractable = !!(interactablesForCurrentLocation[subject]);

		if (subjectIsItem) {

			var item = itemsForCurrentLocation[subject];
			var customInteractionsForItem = item.interactions;

			if (!customInteractionsForItem || !(customInteractionsForItem[interaction])) {
				throw new Error(`Item ${subject} doesn't have a custom interaction defined for ${interaction}`);
			}

			return customInteractionsForItem[interaction];
		}

		if (subjectIsInteractable) {

			var interactible = interactablesForCurrentLocation[subject]

			return interactible[interaction];
		}

		if (!subjectIsInteractable && !subjectIsItem) {
			throw new Error(`Subject '${subject}' is neither an interactible or an item for current location`);
		}

		return;
	}

	function isItemInPlayerInventory(gameData: IGameData, itemName: any): boolean {
		return !!(gameData.player.inventory && gameData.player.inventory[itemName]);
	}

	function isItemInCurrentLocation(gameData: IGameData, itemName: any): boolean {

		const currentLocation = getCurrentLocation(gameData);

		return !!(currentLocation.items && currentLocation.items[itemName]);
	}

	function isInteractableInCurrentLocation(gameData: IGameData, interactibleName: any): boolean {

		const currentLocation = getCurrentLocation(gameData);

		return !!(currentLocation.interactables && currentLocation.interactables[interactibleName]);
	}

	function isActionDefinedInCartridge(cartridgeActions: IGameActions, actionName: string): boolean {
		return (typeof cartridgeActions[actionName] === 'function');
	}

	function isActionDefinedInConsole(consoleActions: IGameActions, actionName: string): boolean {
		return (typeof consoleActions[actionName] === 'function');
	}

	function canInteractWithSubjectInCurrentLocation(gameData: IGameData, actionName: string, subjectName: string): boolean {
		return (isItemInCurrentLocation(gameData, subjectName) && isActionDefinedOnItemInCurrentLocation(gameData, actionName, subjectName)) ||
			(isInteractableInCurrentLocation(gameData, subjectName) && isActionDefinedOnInteractableInCurrentLocation(gameData, actionName, subjectName));
	}

	function isActionDefinedOnItemInCurrentLocation(gameData: IGameData, actionName: string, itemName: string): boolean {

		const currentLocation = getCurrentLocation(gameData);
		const item = currentLocation.items ? currentLocation.items[itemName] : undefined;

		return !!(item && item.interactions && item.interactions[actionName]);
	}

	function isActionDefinedOnInteractableInCurrentLocation(gameData: IGameData, actionName: string, interactableName: string): boolean {
		
		const currentLocation = getCurrentLocation(gameData);
		const interactable = currentLocation.interactables ? currentLocation.interactables[interactableName] : undefined;
		
		return !!(interactable && interactable[actionName]);
	}

	function moveItem(itemName: any, startLocation: any, endLocation: any){
		var itemName = getItemName(startLocation, itemName);
		var itemAtOrigin = getItem(startLocation, itemName);
		if(itemAtOrigin === undefined){
			throw 'itemDoesNotExist';
		}
		var itemAtDestination = getItem(endLocation, itemName);
		if(itemAtDestination === undefined) {
			endLocation[itemName] = clone(itemAtOrigin);
			endLocation[itemName].quantity = 1;
		} else {
			++endLocation[itemName].quantity;
		}
		if (itemAtOrigin.hasOwnProperty('quantity')){
			--itemAtOrigin.quantity;
			if(itemAtOrigin.quantity === 0){
				delete startLocation[itemName];
			}
		}
	}

	return {
		input: input,
		registerCartridge: registerCartridge
	};

}
