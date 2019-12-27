"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// === Import Necessary Functionality ===
var fileSystem = require('fs');
var default_parser_1 = require("./default.parser");
function createConsole(parser) {
    parser = parser || new default_parser_1.DefaultParser();
    // === Create Necessary Variables ===
    var debugMode = true;
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
        return actions[command.action](game, command);
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
}
exports.default = createConsole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zb2xlL2NvbnNvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFDekMsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLG1EQUFpRDtBQUdqRCxTQUF3QixhQUFhLENBQUMsTUFBZ0I7SUFFckQsTUFBTSxHQUFHLE1BQU0sSUFBSSxJQUFJLDhCQUFhLEVBQUUsQ0FBQztJQUV2QyxxQ0FBcUM7SUFDckMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLElBQUksS0FBSyxHQUFRLEVBQUUsQ0FBQztJQUNwQixJQUFJLG1CQUFtQixHQUFRLEVBQUUsQ0FBQztJQUVsQyxnQ0FBZ0M7SUFDaEMsdUhBQXVIO0lBQ3ZILGdDQUFnQztJQUNoQyxTQUFTLEtBQUssQ0FBQyxLQUFVLEVBQUUsTUFBVztRQUNyQyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixJQUFHLElBQUksRUFBQztZQUNQLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDbkMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDckIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQ3RCLElBQUksWUFBWSxDQUFDO1lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDakQsSUFBSTtnQkFDSCxJQUFJO29CQUNILEtBQUssQ0FBQywwQ0FBMEMsR0FBQyxPQUFPLENBQUMsTUFBTSxHQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNyRSxZQUFZLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMs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