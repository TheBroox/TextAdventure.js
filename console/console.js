// === Debug Variable ===
var debugMode = true;

// === Import Necessary Functionality ===
var fileSystem = require('fs');
var parser = require('./parser.js');

// === Creat Necessary Variables ===
var games = {};

// ----------------------------\
// === Main Function ==================================================================================================
// ----------------------------/
exports.input = function(input, gameID){
	var command = parser.parse(input);
	var game = games[gameID];
	if(game){
		var gameFunctions = game.gameFunctions;
		game = game.gameData;
		++game.commandCounter;
		var returnString;
		console.log(gameID + ': ' + game.commandCounter);
		try {
			try {
				debug('---Attempting to run cartridge command "'+command.action+'"');
				returnString = eval('gameFunctions.'+command.action+'(game,command,actions)');
			} catch(cartridgeCommandError) {
				debug('-----'+cartridgeCommandError);
				debug('---Attempting to run cartridge command "'+command.action+'"');
				returnString = eval('actions.'+command.action+'(game,command)');
			}
		} catch(consoleCommandError){
			try {
				debug('-----'+consoleCommandError);
				debug('---Attempting to perform '+command.action+' interaction');
				returnString = interact(game, command.action, command.subject);
			} catch (interactionError) {
				debug('-----'+interactionError);
			}
		}
		if(returnString === undefined){
			returnString = "I don't know how to do that.";
		} else {
			try {
				var updateRoomString = getCurrentLocation(game).updateRoom(command);
			} catch(updateRoomError){
				debug('---Failed to Perform updateRoom()');
				debug('-----'+updateRoomError);
			}
		}
		if(updateRoomString === undefined){
			return returnString;
		} else {
			return updateRoomString;
		}
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
function listCartridges(){
	var cartridges = fileSystem.readdirSync('./cartridges/');
	var cartridgesFormated = 'Avaliable Games: \n';
	for(var i = 0; i < cartridges.length; i++){
		cartridgesFormated = cartridgesFormated.concat(cartridges[i].substr(0,cartridges[i].lastIndexOf('.')));
		if(i < cartridges.length-1){
			cartridgesFormated = cartridgesFormated.concat('\n');
		}
	}
	return cartridgesFormated;
}

function loadCartridge(gameID, gameName){
	if (!gameName){
		return "Specify game cartridge to load.";
	}
	try {
		var file = eval('require("../cartridges/'+gameName+'.js")');
		games[gameID] = {gameData: file.gameData, gameFunctions: file.gameFunctions};
		return games[gameID].gameData.introText + '\n' + getLocationDescription(games[gameID].gameData);
	} catch(error){
		return "Could not load " + gameName;
	}
}

// ----------------------------\
// === Game Commands ==================================================================================================
// ----------------------------/
var actions = {

	drop : function(game, command){
		if(!command.subject){
			return 'What do you want to drop?';
		}
		try{
			return interact(game, 'drop', command.subject);
		} catch(error) {
			try {
				var currentLocation = getCurrentLocation(game);
				moveItem(command.subject, game.player.inventory, currentLocation.items);
				var item = getItem(currentLocation.items, command.subject);
				item.hidden = false;
				return command.subject + ' dropped';
			} catch(error2){
				return 'You do not have a ' + command.subject + ' to drop.';
			}
		}
	},

	go : function(game, command){
		if(!command.subject){
			return 'Where do you want to go?';
		}
		var exits = getCurrentLocation(game).exits;
		var playerDestination = null
		try {
			playerDestination = exits[command.subject].destination;
		} catch (error) {
			try {
				for(var exit in exits){
					var exitObject = exits[exit];
					if(exitObject.displayName.toLowerCase() === command.subject){
						playerDestination = exitObject.destination;
					}
				}
			} catch (error2) {
				return 'You can\'t go there';
			}
		}
		getCurrentLocation(game).firstVisit = false;
		if (getCurrentLocation(game).teardown !== undefined){
			getCurrentLocation(game).teardown();
		}
		if (game.map[playerDestination].setup !== undefined){
			game.map[playerDestination].setup();
		}
		game.player.currentLocation = playerDestination;
		return getLocationDescription(game);
	},

	inventory : function(game, command){
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
			return 'Your inventory is empty.';
		} else {
			return inventoryList;
		}
	},

	look : function(game, command){
		if(!command.subject){
			return getLocationDescription(game, true);
		}
		try {
			return getItem(game.player.inventory, command.subject).description;
		} catch(error) {
			try {
				return interact(game, 'look', command.subject);
			} catch(error2) {
				return 'There is nothing important about the '+command.subject+'.';
			}
		}
	},

	take : function(game, command){
		if(!command.subject){
			return 'What do you want to take?';
		}
		try{
			return interact(game, 'take', command.subject);
		} catch(error) {
			try {
				moveItem(command.subject, getCurrentLocation(game).items, game.player.inventory);
				return command.subject + ' taken';
			} catch(error2){
				return 'Best just to leave the ' + command.subject + ' as it is.';
			}
		}
	},

	use : function(game, command){
		//TODO Finish Function
		return "TODO";
	}
};


// ----------------------------\
// === Helper Functions ===============================================================================================
// ----------------------------/
function clone(objectToBeCloned){
	return JSON.parse(JSON.stringify(objectToBeCloned));
}

function debug(debugText){
	if(debugMode){console.log(debugText);}
}

function getCurrentLocation(game){
	return game.map[game.player.currentLocation];
}

function getLocationDescription(game, forcedLongDescription){
	var currentLocation = getCurrentLocation(game);
	var description;
	if(currentLocation.firstVisit || forcedLongDescription){
		description = currentLocation.description;
		for(var item in currentLocation.items){
			var itemObject = currentLocation.items[item];
			if(!itemObject.hidden){
				if(itemObject.quantity > 1){
					description = description.concat(' There are '+itemObject.quantity+' '+itemObject.displayName+'s here.');
				} else {
					description = description.concat(' There is a '+itemObject.displayName+' here.');
				}
			}
		}
		var exitString = ' Exits are';
		var exitCount = 1;
		for(var exit in currentLocation.exits){
			var exitObject = currentLocation.exits[exit];
			switch (exitCount){
				case 1 :
					exitString = exitString.concat(' '+exitObject.displayName);
					break;
				default :
					exitString = exitString.concat(', '+exitObject.displayName);
			}
			++exitCount;
		}
		description = description.concat(exitString.concat('.'));
	} else {
		description = currentLocation.displayName;
	}
	return description;
}

function getItem(itemLocation, itemName){
	return itemLocation[getItemName(itemLocation, itemName)];
}

function getItemName(itemLocation, itemName){
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

function interact(game, interaction, subject){
	try {
		var interactionResult = eval('game.map.'+game.player.currentLocation+'.interactables.'+subject+'.'+interaction+'();');
		if(interactionResult === undefined){
			throw 'noFunction';
		}
		return interactionResult;
	} catch(error) {
		var interactionResult = getCurrentLocation(game).interactables[subject][interaction];
		if(interactionResult === undefined || typeof interactionResult === 'function'){
			throw 'noString';
		}
		return interactionResult;
	}
}

function moveItem(itemName, startLocation, endLocation){
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
	return 'success';
}