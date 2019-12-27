"use strict";
var cartridge = {
    gameData: {
        commandCounter: 0,
        gameOver: false,
        introText: 'muie prostule',
        outroText: 'muie de sfarsit prostule',
        player: {
            currentLocation: 'initial',
            inventory: {}
        },
        map: {
            initial: {
                description: 'this is the initial location',
                firstVisit: true,
                displayName: 'Initial location',
                interactables: {
                    window: {
                        look: 'te uiti pe geam ca un prost'
                    }
                },
                exits: {
                    end: {
                        displayName: 'Catre sfarsit',
                        destination: 'end'
                    }
                }
            },
            end: {
                description: 'this is the end location',
                firstVisit: true,
                displayName: 'End location',
                setup: function () {
                    cartridge.gameData.map['end'].description = 's-a terminat prostule';
                    cartridge.gameData.gameOver = true;
                }
            }
        }
    },
    gameActions: {
        vomit: function (gameData, command, consoleInterface) {
            return "Ai borat cu succes pe " + command.subject;
        },
        burp: function (gameData, command) {
            gameData.player.burpCounter = gameData.player.burpCounter || 0;
            return "You burped " + ++gameData.player.burpCounter + " times until now";
        }
    }
};
module.exports = cartridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFobW9seGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NhcnRyaWRnZXMvamFobW9seGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxJQUFNLFNBQVMsR0FBZTtJQUMxQixRQUFRLEVBQUU7UUFDTixjQUFjLEVBQUUsQ0FBQztRQUNqQixRQUFRLEVBQUUsS0FBSztRQUNmLFNBQVMsRUFBRSxlQUFlO1FBQzFCLFNBQVMsRUFBRSwwQkFBMEI7UUFDckMsTUFBTSxFQUFFO1lBQ0osZUFBZSxFQUFFLFNBQVM7WUFDMUIsU0FBUyxFQUFFLEVBQUU7U0FDaEI7UUFDRCxHQUFHLEVBQUU7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLDhCQUE4QjtnQkFDM0MsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFdBQVcsRUFBRSxrQkFBa0I7Z0JBQy9CLGFBQWEsRUFBRTtvQkFDWCxNQUFNLEVBQUU7d0JBQ0osSUFBSSxFQUFFLDZCQUE2QjtxQkFDdEM7aUJBQ0o7Z0JBQ0QsS0FBSyxFQUFFO29CQUNILEdBQUcsRUFBRTt3QkFDRCxXQUFXLEVBQUUsZUFBZTt3QkFDNUIsV0FBVyxFQUFFLEtBQUs7cUJBQ3JCO2lCQUNKO2FBQ0o7WUFDRCxHQUFHLEVBQUU7Z0JBQ0QsV0FBVyxFQUFFLDBCQUEwQjtnQkFDdkMsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFdBQVcsRUFBRSxjQUFjO2dCQUMzQixLQUFLLEVBQUU7b0JBQ0gsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxHQUFHLHVCQUF1QixDQUFDO29CQUNwRSxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZDLENBQUM7YUFDSjtTQUNKO0tBQ0o7SUFDRCxXQUFXLEVBQUU7UUFDVCxLQUFLLEVBQUUsVUFBQyxRQUFtQixFQUFFLE9BQWlCLEVBQUUsZ0JBQW9DO1lBQ2hGLE9BQU8sMkJBQXlCLE9BQU8sQ0FBQyxPQUFTLENBQUM7UUFDdEQsQ0FBQztRQUNELElBQUksRUFBRSxVQUFDLFFBQW1CLEVBQUUsT0FBaUI7WUFFekMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO1lBRS9ELE9BQU8sZ0JBQWMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcscUJBQWtCLENBQUM7UUFDekUsQ0FBQztLQUNKO0NBQ0osQ0FBQztBQUVGLGlCQUFTLFNBQVMsQ0FBQyJ9