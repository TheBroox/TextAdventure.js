import { DefaultConsoleActons, ICartridge } from "../../core/shims/textadventurejs.shim";
import { GameBuilder } from "../../builders/game.builder";
import fs from 'fs';
import path from 'path';

const introText = fs.readFileSync(path.join(__dirname, 'introtext.txt'), 'utf8').toString();

export = (savedCartridge?: ICartridge) => {

    const gameBuilder: GameBuilder = new GameBuilder();

    gameBuilder
    .introText(introText)
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
        
                            if (context.getPlayerProperty('isVillageSchoolDoorOpened')) {

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
                            return "The window is baricaded.";
                        });
        
                    interactables.add("cabinet")
                        .on(DefaultConsoleActons.look, context => {
        
                            context.spawnInteractableInLocation('Village.School', 'drawer', interactable => {

                                interactable
                                    .on('open', context => {
            
                                        context.spawnItemInLocation('Village.School', 'key', item => {

                                            item
                                                .onUse((context, object) => {
                                                    
                                                    if (object === 'door') {
                                                        context.setPlayerProperty('isVillageSchoolDoorOpened', true);
                                                        return "The door is unlocked."
                                                    }

                                                    return "Key must be used on something.";
                                                });
                                        });
                                            
                                        return "There's a key inside.";
                                    });
                            })
        
                            return "An old cabinet with a single drawer.";
                        });
                })
                .configureItems(items => {
                    
                    /*
                    items.add('dildo')
                        .displayName('dildo')
                        .description('A huge dildo.')
                        .onTaken(() => {
                            console.log("Appears to have been used.");
                        })
                        .on('look', () => {
                            return "Lo and behold.";
                        });
                    */
                })
                .configureExits(exits => {
                    

                });
        });

        map.configureLocation('Village.Square', location => {

            location
                .displayName("Square")
                .description("The village's square")
                .onSetup(context => {
                    // context.setGameOver("Eh, nothing to do from here... Type 'exit' to end game");
                })
                .configureExits(exits => {
                    exits.add('school')
                        .destination('Village.School')
                        .displayName('School');
                });
        });
    })
    .configurePlayer(player => {

        player.startingLocation('Village.School');
    });

    return gameBuilder.build();

}