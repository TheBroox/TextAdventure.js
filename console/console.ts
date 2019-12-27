// === Debug Variable ===
var debugMode = true;

// === Import Necessary Functionality ===
var fileSystem = require('fs');
var parser = require('./parser.js');

module.exports = function createConsole() {

	// === Create Necessary Variables ===
	var games: any = {};
	var availableCartridges: any = {};

	// ----------------------------\
	// === Main Function ==================================================================================================
	// ----------------------------/
	function input(input: any, gameID: any) {
		var command = parser.parse(input);
		var game = games[gameID];
		if(game){
			var gameActions = game.gameActions;
			game = game.gameData;
			++game.commandCounter;
			var returnString;
			console.log(gameID + ': ' + game.commandCounter);
			try {
				try {
					debug('---Attempting to run cartridge command "'+command.action+'"');
					returnString = gameActions[command.action](game, command, consoleInterface);
				} catch(cartridgeCommandError) {
					debug('-----'+cartridgeCommandError);
					debug('---Attempting to run cartridge command "'+command.action+'"');
					returnString = actions[command.action](game, command).message;
				}
			} catch(consoleCommandError){
				try {
					debug('-----'+consoleCommandError);
					debug('---Attempting to perform '+command.action+' interaction');
					returnString = interactWithSubjectInCurrentLocation(game, command.action, command.subject);
				} catch (interactionError) {
					debug('-----'+interactionError);
				}
			}
			if(returnString === undefined){
				returnString = "I don't know how to do that.";
			} else {
				try {
					var updateLocationString = getCurrentLocation(game).updateLocation(command);
				} catch(updateLocationError){
					debug('---Failed to Perform updateLocation()');
					debug('-----'+updateLocationError);
				}
			}
			if(updateLocationString !== undefined){
				returnString = updateLocationString;
			}
			return checkForGameEnd(game, returnString);
		} else {
			console.log(gameID + ': no game');
			if(command.action === 'load'){
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

		// verified
		die : function(game: any, command: any){
			delete games[game.gameID];
			return {message:'You are dead', success: true};
		},

		drop : function(game: any, command: any){
			if(!command.subject){
				return {message: 'What do you want to drop?', success: false};
			}
			try{
				return {message: interactWithSubjectInCurrentLocation(game, 'drop', command.subject), success: true};
			} catch(error) {
				try {
					var currentLocation = getCurrentLocation(game);
					moveItem(command.subject, game.player.inventory, currentLocation.items);
					var item = getItem(currentLocation.items, command.subject);
					item.hidden = false;
					return {message: command.subject + ' dropped', success: true};
				} catch(error2){
					return {message: 'You do not have a ' + command.subject + ' to drop.', success: false};
				}
			}
		},

		go : function(game: any, command: any){
			if(!command.subject){
				return {message: 'Where do you want to go?', success: false};
			}
			var exits = getCurrentLocation(game).exits;
			var playerDestination = null
			try {
				playerDestination = exits[command.subject].destination;
			} catch (error) {
				for(var exit in exits){
					var exitObject = exits[exit];
					if(exitObject.displayName.toLowerCase() === command.subject){
						playerDestination = exitObject.destination;
					}
				}
			}
			if(playerDestination === null){
				return {message: 'You can\'t go there.', success: false};
			}
			getCurrentLocation(game).firstVisit = false;
			if (getCurrentLocation(game).teardown !== undefined){
				getCurrentLocation(game).teardown();
			}
			if (game.map[playerDestination].setup !== undefined){
				game.map[playerDestination].setup();
			}
			game.player.currentLocation = playerDestination;
			return {message: getLocationDescription(game), success: true};
		},

		// verified
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

		// verified
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
		if(debugMode){
			console.log(debugText);
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

	function getCurrentLocation(game: any){
		return game.map[game.player.currentLocation];
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

	function isItemInPlayerInventory(game: any, itemName: any) {
		return !!(game.player.inventory && game.player.inventory[itemName]);
	}

	function isItemInCurrentLocation(game: any, itemName: any) {

		var currentLocation = getCurrentLocation(game);

		return !!(currentLocation.items && currentLocation.items[itemName]);
	}

	function isInteractableInCurrentLocation(game: any, interactibleName: any) {

		var currentLocation = getCurrentLocation(game);

		return !!(currentLocation.interactables && currentLocation.interactables[interactibleName]);
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
