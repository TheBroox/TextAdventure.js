"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
// === Necessary Exports ===
module.exports.gameData = gameData;
module.exports.gameActions = gameActions;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29sZF9taW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ29sZF9taW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsb0JBQW9CO0FBQ3BCLElBQUksUUFBUSxHQUFjO0lBQ3pCLGNBQWMsRUFBRyxDQUFDO0lBQ2xCLFFBQVEsRUFBRyxLQUFLO0lBQ2hCLFNBQVMsRUFBRyw0TUFBNE07SUFDeE4sU0FBUyxFQUFHLHFCQUFxQjtJQUNqQyxNQUFNLEVBQUc7UUFDUixlQUFlLEVBQUcsY0FBYztRQUNoQyxTQUFTLEVBQUcsRUFBRTtRQUNkLFdBQVcsRUFBRyxLQUFLO0tBQ25CO0lBQ0QsR0FBRyxFQUFHO1FBQ0wsWUFBWSxFQUFHO1lBQ2QsVUFBVSxFQUFHLElBQUk7WUFDakIsV0FBVyxFQUFHLGVBQWU7WUFDN0IsV0FBVyxFQUFHLDRIQUE0SDtZQUMxSSxhQUFhLEVBQUc7Z0JBQ2YsT0FBTyxFQUFHLEVBQUUsSUFBSSxFQUFHLHVGQUF1RixFQUFFO2dCQUM1RyxJQUFJLEVBQUcsRUFBRSxJQUFJLEVBQUcscUZBQXFGLEVBQUU7Z0JBQ3ZHLElBQUksRUFBRyxFQUFFLElBQUksRUFBRywwRUFBMEUsRUFBRTthQUM1RjtZQUNELEtBQUssRUFBRztnQkFDUCxNQUFNLEVBQUc7b0JBQ1IsV0FBVyxFQUFHLGNBQWM7b0JBQzVCLFdBQVcsRUFBRywyRkFBMkY7b0JBQ3pHLEdBQUcsRUFBRyxjQUFXLE9BQU8sY0FBYyxFQUFFLENBQUMsQ0FBQSxDQUFDO29CQUMxQyxRQUFRLEVBQUcsQ0FBQztvQkFDWixNQUFNLEVBQUcsSUFBSTtpQkFDYjthQUNEO1lBQ0QsS0FBSyxFQUFHO2dCQUNQLE1BQU0sRUFBRztvQkFDUixXQUFXLEVBQUcsUUFBUTtvQkFDdEIsV0FBVyxFQUFHLFFBQVE7aUJBQ3RCO2FBQ0Q7U0FDRDtRQUNELE1BQU0sRUFBRztZQUNSLFVBQVUsRUFBRyxJQUFJO1lBQ2pCLFdBQVcsRUFBRyxRQUFRO1lBQ3RCLFdBQVcsRUFBRyx5REFBeUQ7WUFDdkUsS0FBSyxFQUFHO2dCQUNQLE9BQU8sRUFBRztvQkFDVCxXQUFXLEVBQUcsU0FBUztvQkFDdkIsV0FBVyxFQUFHLGNBQWM7aUJBQzVCO2dCQUNELE1BQU0sRUFBRztvQkFDUixXQUFXLEVBQUcsUUFBUTtvQkFDdEIsV0FBVyxFQUFHLEtBQUs7aUJBQ25CO2FBQ0Q7U0FDRDtRQUNELEtBQUssRUFBRztZQUNQLFVBQVUsRUFBRyxJQUFJO1lBQ2pCLFdBQVcsRUFBRyxhQUFhO1lBQzNCLEtBQUssRUFBRyxjQUFXLEdBQUcsRUFBRSxDQUFDLENBQUEsQ0FBQztTQUMxQjtLQUNEO0NBQ0QsQ0FBQztBQUVGLHVCQUF1QjtBQUN2QixJQUFJLFdBQVcsR0FBRyxFQUVqQixDQUFBO0FBRUQsNEJBQTRCO0FBQzVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFFekMsMkJBQTJCO0FBQzNCLFNBQVMsR0FBRztJQUNYLElBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUM7UUFDOUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEdBQUcseUNBQXlDLENBQUM7S0FDNUU7U0FBTTtRQUNOLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxHQUFHLHdHQUF3RyxDQUFDO0tBQzNJO0lBQ0QsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDMUIsQ0FBQztBQUVELFNBQVMsY0FBYztJQUN0QixRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkMsT0FBTyxnREFBZ0QsQ0FBQTtBQUN4RCxDQUFDIn0=