import { DefaultConsoleActons } from "../core/shims/textadventurejs.shim";
import { GameBuilder } from "../builders/game.builder";

const game: GameBuilder = new GameBuilder();

game
.introText("you are teleported in the village's school.'")
.configureMap(map => {

    map.configureLocation('Village.School', location => {

        location
            .description("You're in the village's school. There's a window, a door, and a cabinet.")
            .displayName("School")
            .configureInteractables(interactables => {
    
                interactables.add("door")
                    .on(DefaultConsoleActons.look, () => {
                        return "the door leads outside.";
                    })
                    .on("open", context => {
    
                        if (context.getPlayerProperty('hasSchoolKey')) {

                            context.spawnExitInLocation('Village.School', 'outside', exit => {
                                exit
                                    .displayName('Outside')
                                    .destination('Village.Square');
                            });
                                
                            return "The door opens. You can go outside.";
                        } else {
                            return "The door is locked.";
                        }
                    })
    
                interactables.add("window")
                    .on(DefaultConsoleActons.look, () => {
                        return "the window is baricaded.";
                    });
    
                interactables.add("cabinet")
                    .on(DefaultConsoleActons.look, context => {
    
                        context.spawnInteractableInLocation('Village.School', 'drawer', interactable => {

                            interactable
                                .on('open', context => {
        
                                    context.spawnItemInLocation('Village.School', 'key', item => {

                                        item
                                            .onTaken(() => {
                                                context.setPlayerProperty('hasSchoolKey', true);
                                            })
                                            .onUse(() => {
                                                return "You use the key.";
                                            });
                                    });
                                        
                                    return "There's a key inside.";
                                });
                        })
    
                        return "an old cabinet with a single drawer.";
                    });
            })
            .configureItems((items: any) => {
                
            })
            .configureExits((exits: any) => {
                
            })
    })
})
.configurePlayer(player => {

    player.startingLocation('Village.School');
});

const cartridge = game.build();

console.log("game built");
console.log(JSON.stringify(cartridge, null, 4));

console.log('locations:');
Object.keys(cartridge.gameData.map).forEach(locationName => {

    console.log(locationName);
    console.log(cartridge.gameData.map[locationName].interactables);
});


export = cartridge;
