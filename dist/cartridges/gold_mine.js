"use strict";
// === Game Data ===
var gameData = {
    commandCounter: 0,
    gameOver: false,
    introText: 'Welcome to the Crooked Gulch Gold Mine. What it lacks in safety precautions it more than makes up for in gold. Watch your step and you might just make it out with riches beyond your wildest imagination!',
    outroText: 'Thanks For playing!',
    player: {
        currentLocation: 'MineEntrance',
        inventory: {},
        lightSource: false
    },
    map: {
        MineEntrance: {
            firstVisit: true,
            displayName: 'Mine Entrance',
            description: 'You stand at the partially collapsed entrance to the mine. Nearby there is a sign sticking out of a pile of miner helmets.',
            interactables: {
                helmets: { look: 'It is a pile of miner helmets with lights on them. They seem to still be operational.' },
                sign: { look: 'The sign reads "Crooked Gulch Gold Mine" and has a note tacked to the bottom of it.' },
                note: { look: 'Written in an untidy scroll the note reads "Generator blew. Lights out."' }
            },
            items: {
                helmet: {
                    displayName: 'Miner Helmet',
                    description: 'A trusty old miner helmet covered in minor dents. Still seems sturdy and the light works.',
                    use: function () { return useLightSource(); },
                    quantity: 1,
                    hidden: true
                }
            },
            exits: {
                inside: {
                    displayName: 'Inside',
                    destination: 'Tunnel'
                }
            },
        },
        Tunnel: {
            firstVisit: true,
            displayName: 'Tunnel',
            description: 'It is dimly lit here and look much darker further back.',
            exits: {
                outside: {
                    displayName: 'Outside',
                    destination: 'MineEntrance'
                },
                deeper: {
                    displayName: 'Deeper',
                    destination: 'End'
                }
            }
        },
        'End': {
            firstVisit: true,
            description: 'placeholder',
            setup: function () { end(); }
        }
    }
};
// === Game Actions ===
var gameActions = {};
// === Helper Functions ===
function end() {
    if (gameData.player.lightSource) {
        gameData.map['End'].description = 'You found more gold than you can carry.';
    }
    else {
        gameData.map['End'].description = 'It is so dark, you can\'t see anything! You fall down an unseen crevice. Your body is never recovered.';
    }
    gameData.gameOver = true;
}
function useLightSource() {
    gameData.player.lightSource = true;
    return 'You click on the light attached to the helmet.';
}
var cartridge = {
    gameData: gameData,
    gameActions: gameActions
};
module.exports = cartridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29sZF9taW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NhcnRyaWRnZXMvZ29sZF9taW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxvQkFBb0I7QUFDcEIsSUFBSSxRQUFRLEdBQWM7SUFDekIsY0FBYyxFQUFHLENBQUM7SUFDbEIsUUFBUSxFQUFHLEtBQUs7SUFDaEIsU0FBUyxFQUFHLDRNQUE0TTtJQUN4TixTQUFTLEVBQUcscUJBQXFCO0lBQ2pDLE1BQU0sRUFBRztRQUNSLGVBQWUsRUFBRyxjQUFjO1FBQ2hDLFNBQVMsRUFBRyxFQUFFO1FBQ2QsV0FBVyxFQUFHLEtBQUs7S0FDbkI7SUFDRCxHQUFHLEVBQUc7UUFDTCxZQUFZLEVBQUc7WUFDZCxVQUFVLEVBQUcsSUFBSTtZQUNqQixXQUFXLEVBQUcsZUFBZTtZQUM3QixXQUFXLEVBQUcsNEhBQTRIO1lBQzFJLGFBQWEsRUFBRztnQkFDZixPQUFPLEVBQUcsRUFBRSxJQUFJLEVBQUcsdUZBQXVGLEVBQUU7Z0JBQzVHLElBQUksRUFBRyxFQUFFLElBQUksRUFBRyxxRkFBcUYsRUFBRTtnQkFDdkcsSUFBSSxFQUFHLEVBQUUsSUFBSSxFQUFHLDBFQUEwRSxFQUFFO2FBQzVGO1lBQ0QsS0FBSyxFQUFHO2dCQUNQLE1BQU0sRUFBRztvQkFDUixXQUFXLEVBQUcsY0FBYztvQkFDNUIsV0FBVyxFQUFHLDJGQUEyRjtvQkFDekcsR0FBRyxFQUFHLGNBQVcsT0FBTyxjQUFjLEVBQUUsQ0FBQyxDQUFBLENBQUM7b0JBQzFDLFFBQVEsRUFBRyxDQUFDO29CQUNaLE1BQU0sRUFBRyxJQUFJO2lCQUNiO2FBQ0Q7WUFDRCxLQUFLLEVBQUc7Z0JBQ1AsTUFBTSxFQUFHO29CQUNSLFdBQVcsRUFBRyxRQUFRO29CQUN0QixXQUFXLEVBQUcsUUFBUTtpQkFDdEI7YUFDRDtTQUNEO1FBQ0QsTUFBTSxFQUFHO1lBQ1IsVUFBVSxFQUFHLElBQUk7WUFDakIsV0FBVyxFQUFHLFFBQVE7WUFDdEIsV0FBVyxFQUFHLHlEQUF5RDtZQUN2RSxLQUFLLEVBQUc7Z0JBQ1AsT0FBTyxFQUFHO29CQUNULFdBQVcsRUFBRyxTQUFTO29CQUN2QixXQUFXLEVBQUcsY0FBYztpQkFDNUI7Z0JBQ0QsTUFBTSxFQUFHO29CQUNSLFdBQVcsRUFBRyxRQUFRO29CQUN0QixXQUFXLEVBQUcsS0FBSztpQkFDbkI7YUFDRDtTQUNEO1FBQ0QsS0FBSyxFQUFHO1lBQ1AsVUFBVSxFQUFHLElBQUk7WUFDakIsV0FBVyxFQUFHLGFBQWE7WUFDM0IsS0FBSyxFQUFHLGNBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQSxDQUFDO1NBQzFCO0tBQ0Q7Q0FDRCxDQUFDO0FBRUYsdUJBQXVCO0FBQ3ZCLElBQUksV0FBVyxHQUFHLEVBRWpCLENBQUE7QUFFRCwyQkFBMkI7QUFDM0IsU0FBUyxHQUFHO0lBQ1gsSUFBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBQztRQUM5QixRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsR0FBRyx5Q0FBeUMsQ0FBQztLQUM1RTtTQUFNO1FBQ04sUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEdBQUcsd0dBQXdHLENBQUM7S0FDM0k7SUFDRCxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUMxQixDQUFDO0FBRUQsU0FBUyxjQUFjO0lBQ3RCLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNuQyxPQUFPLGdEQUFnRCxDQUFBO0FBQ3hELENBQUM7QUFHRCxJQUFNLFNBQVMsR0FBZTtJQUM3QixRQUFRLEVBQUUsUUFBUTtJQUNsQixXQUFXLEVBQUUsV0FBVztDQUN4QixDQUFBO0FBRUQsaUJBQVMsU0FBUyxDQUFDIn0=