// === Debug Variable ===
var debugMode = true;
// === Import Necessary Functionality ===
var fileSystem = require('fs');
var parser = require('./parser.js');
module.exports = function createConsole() {
    // === Creat Necessary Variables ===
    var games = {};
    var availableCartridges = {};
    // ----------------------------\
    // === Main Function ==================================================================================================
    // ----------------------------/
    function input(input, gameID) {
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
                    returnString = gameActions[command.action](game, command, consoleInterface);
                }
                catch (cartridgeCommandError) {
                    debug('-----' + cartridgeCommandError);
                    debug('---Attempting to run cartridge command "' + command.action + '"');
                    returnString = actions[command.action](game, command).message;
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
    }
    ;
    // ----------------------------\
    // === Game Setup Functions ===========================================================================================
    // ----------------------------/
    function registerCartridge(name, cartridgeDefinition) {
        availableCartridges[name] = cartridgeDefinition;
    }
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
    return {
        input: input,
        registerCartridge: registerCartridge
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnNvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEseUJBQXlCO0FBQ3pCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUVyQix5Q0FBeUM7QUFDekMsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUVwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsYUFBYTtJQUV2QyxvQ0FBb0M7SUFDcEMsSUFBSSxLQUFLLEdBQVEsRUFBRSxDQUFDO0lBQ3BCLElBQUksbUJBQW1CLEdBQVEsRUFBRSxDQUFDO0lBRWxDLGdDQUFnQztJQUNoQyx1SEFBdUg7SUFDdkgsZ0NBQWdDO0lBQ2hDLFNBQVMsS0FBSyxDQUFDLEtBQVUsRUFBRSxNQUFXO1FBQ3JDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLElBQUcsSUFBSSxFQUFDO1lBQ1AsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNuQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNyQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDdEIsSUFBSSxZQUFZLENBQUM7WUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNqRCxJQUFJO2dCQUNILElBQUk7b0JBQ0gsS0FBSyxDQUFDLDBDQUEwQyxHQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JFLFlBQVksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFB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