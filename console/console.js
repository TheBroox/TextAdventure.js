// === Debug Variable ===
var debugMode = true;
// === Import Necessary Functionality ===
var fileSystem = require('fs');
var parser = require('./parser.js');
// === Creat Necessary Variables ===
var games = {};
var availableCartridges = {};
// ----------------------------\
// === Main Function ==================================================================================================
// ----------------------------/
exports.input = function (input, gameID) {
    var command = parser.parse(input);
    var game = games[gameID];
    if (game) {
        var gameActions = game.gameActions;
        game = game.gameData;
        ++game.commandCounter;
        var returnString;
        console.log(gameID + ': ' + game.commandCounter);
        try {
            try {
                debug('---Attempting to run cartridge command "' + command.action + '"');
                returnString = gameActions[command.action](game, command, consoleInterface); // eval('gameActions.'+command.action+'(game,command,consoleInterface)');
                // returnString = eval('gameActions.'+command.action+'(game,command,consoleInterface)');
            }
            catch (cartridgeCommandError) {
                debug('-----' + cartridgeCommandError);
                debug('---Attempting to run cartridge command "' + command.action + '"');
                returnString = actions[command.action](game, command).message; // eval('actions.'+command.action+'(game,command)').message;
                // returnString = eval('actions.'+command.action+'(game,command)').message;
            }
        }
        catch (consoleCommandError) {
            try {
                debug('-----' + consoleCommandError);
                debug('---Attempting to perform ' + command.action + ' interaction');
                returnString = interactWithSubjectInCurrentLocation(game, command.action, command.subject);
            }
            catch (interactionError) {
                debug('-----' + interactionError);
            }
        }
        if (returnString === undefined) {
            returnString = "I don't know how to do that.";
        }
        else {
            try {
                var updateLocationString = getCurrentLocation(game).updateLocation(command);
            }
            catch (updateLocationError) {
                debug('---Failed to Perform updateLocation()');
                debug('-----' + updateLocationError);
            }
        }
        if (updateLocationString !== undefined) {
            returnString = updateLocationString;
        }
        return checkForGameEnd(game, returnString);
    }
    else {
        console.log(gameID + ': no game');
        if (command.action === 'load') {
            return loadCartridge(gameID, command.subject);
        }
        else {
            return listCartridges();
        }
    }
};
// ----------------------------\
// === Game Setup Functions ===========================================================================================
// ----------------------------/
module.exports.registerCartridge = function registerCartridge(name, cartridgeDefinition) {
    availableCartridges[name] = cartridgeDefinition;
};
function listCartridges() {
    var cartridges = Object.keys(availableCartridges);
    if (cartridges.length === 0) {
        return 'No game cartridges found.';
    }
    var cartridgesFormated = 'Available Games: \n';
    for (var i = 0; i < cartridges.length; i++) {
        cartridgesFormated = cartridgesFormated.concat(cartridges[i]);
        if (i < cartridges.length - 1) {
            cartridgesFormated = cartridgesFormated.concat('\n');
        }
    }
    return cartridgesFormated;
}
function loadCartridge(gameID, gameName) {
    if (!gameName) {
        return "Specify game cartridge to load.";
    }
    if (!availableCartridges[gameName]) {
        return "Cartridge " + gameName + " not found.";
    }
    var file = availableCartridges[gameName];
    games[gameID] = { gameData: file.gameData, gameActions: file.gameActions };
    games[gameID].gameData.gameID = gameID;
    return games[gameID].gameData.introText + '\n' + getLocationDescription(games[gameID].gameData);
}
// ----------------------------\
// === Console Actions =================================================================================================
// ----------------------------/
var actions = {
    // verified
    die: function (game, command) {
        delete games[game.gameID];
        return { message: 'You are dead', success: true };
    },
    drop: function (game, command) {
        if (!command.subject) {
            return { message: 'What do you want to drop?', success: false };
        }
        try {
            return { message: interactWithSubjectInCurrentLocation(game, 'drop', command.subject), success: true };
        }
        catch (error) {
            try {
                var currentLocation = getCurrentLocation(game);
                moveItem(command.subject, game.player.inventory, currentLocation.items);
                var item = getItem(currentLocation.items, command.subject);
                item.hidden = false;
                return { message: command.subject + ' dropped', success: true };
            }
            catch (error2) {
                return { message: 'You do not have a ' + command.subject + ' to drop.', success: false };
            }
        }
    },
    go: function (game, command) {
        if (!command.subject) {
            return { message: 'Where do you want to go?', success: false };
        }
        var exits = getCurrentLocation(game).exits;
        var playerDestination = null;
        try {
            playerDestination = exits[command.subject].destination;
        }
        catch (error) {
            for (var exit in exits) {
                var exitObject = exits[exit];
                if (exitObject.displayName.toLowerCase() === command.subject) {
                    playerDestination = exitObject.destination;
                }
            }
        }
        if (playerDestination === null) {
            return { message: 'You can\'t go there.', success: false };
        }
        getCurrentLocation(game).firstVisit = false;
        if (getCurrentLocation(game).teardown !== undefined) {
            getCurrentLocation(game).teardown();
        }
        if (game.map[playerDestination].setup !== undefined) {
            game.map[playerDestination].setup();
        }
        game.player.currentLocation = playerDestination;
        return { message: getLocationDescription(game), success: true };
    },
    // verified
    inventory: function (game, command) {
        var inventoryList = 'Your inventory contains:';
        for (var item in game.player.inventory) {
            var itemObject = game.player.inventory[item];
            var itemName = itemObject.displayName;
            if (itemObject.quantity > 1) {
                itemName = itemName.concat(' x' + itemObject.quantity);
            }
            inventoryList = inventoryList.concat('\n' + itemName);
        }
        if (inventoryList === 'Your inventory contains:') {
            return { message: 'Your inventory is empty.', success: true };
        }
        else {
            return { message: inventoryList, success: true };
        }
    },
    // verified
    look: function (game, command) {
        if (!command.subject) {
            return { message: getLocationDescription(game, true), success: true };
        }
        var isInventoryItem = !!(game.player.inventory[command.subject]);
        if (isInventoryItem) {
            debug("Subject " + command.subject + " is an item in the player inventory");
            return { message: getItem(game.player.inventory, command.subject).description, success: true };
        }
        var isCurrentLocationItem = !!(getCurrentLocation(game).items[command.subject]);
        if (isCurrentLocationItem) {
            debug("Subject " + command.subject + " is an item in the current location");
            return { message: getItem(getCurrentLocation(game).items, command.subject).description, success: true };
        }
        var interactionMessage = undefined;
        try {
            interactionMessage = interactWithSubjectInCurrentLocation(game, 'look', command.subject);
        }
        catch (e) {
            debug("Interaction error: " + e);
        }
        if (!interactionMessage) {
            debug("No interaction message specified for command 'look' and subject '" + command.subject + "'");
            return { message: 'There is nothing important about the ' + command.subject + '.', success: false };
        }
        return { message: interactionMessage, success: true };
    },
    take: function (game, command) {
        if (!command.subject) {
            return { message: 'What do you want to take?', success: false };
        }
        try {
            return { message: interactWithSubjectInCurrentLocation(game, 'take', command.subject), success: true };
        }
        catch (error) {
            debug("Take: interact error: " + error);
            try {
                moveItem(command.subject, getCurrentLocation(game).items, game.player.inventory);
                return { message: command.subject + ' taken', success: true };
            }
            catch (error2) {
                debug("Take: moveItem error: " + error2);
                return { message: 'Best just to leave the ' + command.subject + ' as it is.', success: false };
            }
        }
    },
    use: function (game, command) {
        if (!command.subject) {
            return { message: 'What would you like to use?', success: false };
        }
        try {
            return { message: getItem(game.player.inventory, command.subject).use(), success: true };
        }
        catch (itemNotInInventoryError) {
            return { message: 'Can\'t do that.', success: false };
        }
    }
};
// ----------------------------\
// === Helper Functions ===============================================================================================
// ----------------------------/
function checkForGameEnd(game, returnString) {
    if (game.gameOver) {
        returnString = returnString + '\n' + game.outroText;
        actions.die(game, { action: 'die' });
    }
    return returnString;
}
function clone(obj) {
    if (obj == null || typeof (obj) != 'object') {
        return obj;
    }
    var temp = obj.constructor();
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = clone(obj[key]);
        }
    }
    return temp;
}
function consoleInterface(game, command) {
    return actions[command.action](game, command); // eval('actions.'+command.action+'(game,command);')
}
function debug(debugText) {
    if (debugMode) {
        console.log(debugText);
    }
}
function exitsToString(exitsObject) {
    var numOfExits = Object.keys(exitsObject).length;
    if (numOfExits === 0) {
        return '';
    }
    var visibleExits = [];
    for (var exit in exitsObject) {
        var exitObject = exitsObject[exit];
        if (!exitObject.hidden) {
            visibleExits.push(exitObject.displayName);
        }
    }
    switch (visibleExits.length) {
        case 0:
            return '';
        case 1:
            var returnString = ' Exit is ';
            break;
        default:
            var returnString = ' Exits are ';
    }
    for (var i = 0; i < visibleExits.length; ++i) {
        returnString = returnString.concat(visibleExits[i]);
        if (i === visibleExits.length - 2) {
            returnString = returnString.concat(' and ');
        }
        else if (i === visibleExits.length - 1) {
            returnString = returnString.concat('.');
        }
        else {
            returnString = returnString.concat(', ');
        }
    }
    return returnString;
}
function getCurrentLocation(game) {
    return game.map[game.player.currentLocation];
}
function getLocationDescription(game, forcedLongDescription) {
    var currentLocation = getCurrentLocation(game);
    var description;
    if (currentLocation.firstVisit || forcedLongDescription) {
        description = currentLocation.description;
        if (currentLocation.items) {
            description = description.concat(itemsToString(currentLocation.items));
        }
        if (currentLocation.exits) {
            description = description.concat(exitsToString(currentLocation.exits));
        }
    }
    else {
        description = currentLocation.displayName;
    }
    return description;
}
function getItem(itemLocation, itemName) {
    return itemLocation[getItemName(itemLocation, itemName)];
}
function getItemName(itemLocation, itemName) {
    if (itemLocation[itemName] !== undefined) {
        return itemName;
    }
    else {
        for (var item in itemLocation) {
            if (itemLocation[item].displayName.toLowerCase() === itemName) {
                return item;
            }
        }
    }
}
function itemsToString(itemsObject) {
    var numOfItems = Object.keys(itemsObject).length;
    if (numOfItems === 0) {
        return '';
    }
    var visibleItems = [];
    for (var item in itemsObject) {
        var itemObject = itemsObject[item];
        if (!itemObject.hidden) {
            visibleItems.push({ name: itemObject.displayName, quantity: itemObject.quantity });
        }
    }
    if (visibleItems.length === 0) {
        return '';
    }
    if (visibleItems[0].quantity === 1) {
        var returnString = ' There is ';
    }
    else {
        var returnString = ' There are ';
    }
    for (var i = 0; i < visibleItems.length; ++i) {
        if (visibleItems[i].quantity > 1) {
            returnString = returnString.concat(visibleItems[i].quantity + ' ' + visibleItems[i].name + 's');
        }
        else {
            returnString = returnString.concat('a ' + visibleItems[i].name);
        }
        if (i === visibleItems.length - 2) {
            returnString = returnString.concat(' and ');
        }
        else if (i === visibleItems.length - 1) {
            returnString = returnString.concat(' here.');
        }
        else {
            returnString = returnString.concat(', ');
        }
    }
    return returnString;
}
function interactWithSubjectInCurrentLocation(game, interaction, subject) {
    var currentLocation = getCurrentLocation(game);
    var itemsForCurrentLocation = currentLocation.items;
    var interactablesForCurrentLocation = currentLocation.interactables;
    var subjectIsItem = !!(itemsForCurrentLocation[subject]);
    var subjectIsInteractable = !!(interactablesForCurrentLocation[subject]);
    if (subjectIsItem) {
        var item = itemsForCurrentLocation[subject];
        var customInteractionsForItem = item.interactions;
        if (!customInteractionsForItem || !(customInteractionsForItem[interaction])) {
            throw new Error("Item " + subject + " doesn't have a custom interaction defined for " + interaction);
        }
        return customInteractionsForItem[interaction];
    }
    if (subjectIsInteractable) {
        var interactible = interactablesForCurrentLocation[subject];
        return interactible[interaction];
    }
    if (!subjectIsInteractable && !subjectIsItem) {
        throw new Error("Subject '" + subject + "' is neither an interactible or an item for current location");
    }
    return;
}
function isItemInPlayerInventory(game, itemName) {
    return !!(game.player.inventory && game.player.inventory[itemName]);
}
function isItemInCurrentLocation(game, itemName) {
    var currentLocation = getCurrentLocation(game);
    return !!(currentLocation.items && currentLocation.items[itemName]);
}
function isInteractableInCurrentLocation(game, interactibleName) {
    var currentLocation = getCurrentLocation(game);
    return !!(currentLocation.interactables && currentLocation.interactables[interactibleName]);
}
function moveItem(itemName, startLocation, endLocation) {
    var itemName = getItemName(startLocation, itemName);
    var itemAtOrigin = getItem(startLocation, itemName);
    if (itemAtOrigin === undefined) {
        throw 'itemDoesNotExist';
    }
    var itemAtDestination = getItem(endLocation, itemName);
    if (itemAtDestination === undefined) {
        endLocation[itemName] = clone(itemAtOrigin);
        endLocation[itemName].quantity = 1;
    }
    else {
        ++endLocation[itemName].quantity;
    }
    if (itemAtOrigin.hasOwnProperty('quantity')) {
        --itemAtOrigin.quantity;
        if (itemAtOrigin.quantity === 0) {
            delete startLocation[itemName];
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnNvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEseUJBQXlCO0FBQ3pCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUVyQix5Q0FBeUM7QUFDekMsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUVwQyxvQ0FBb0M7QUFDcEMsSUFBSSxLQUFLLEdBQVEsRUFBRSxDQUFDO0FBQ3BCLElBQUksbUJBQW1CLEdBQVEsRUFBRSxDQUFDO0FBRWxDLGdDQUFnQztBQUNoQyx1SEFBdUg7QUFDdkgsZ0NBQWdDO0FBQ2hDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsVUFBUyxLQUFVLEVBQUUsTUFBVztJQUMvQyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QixJQUFHLElBQUksRUFBQztRQUNQLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbkMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDckIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ3RCLElBQUksWUFBWSxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDakQsSUFBSTtZQUNILElBQUk7Z0JBQ0gsS0FBSyxDQUFDLDBDQUEwQyxHQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JFLFlBQVksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FB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