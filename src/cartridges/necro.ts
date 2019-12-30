import { DefaultConsoleActons } from "../core/shims/textadventurejs.shim";
import { GameBuilder } from "../builders/game.builder";

const game: GameBuilder = new GameBuilder();

game.configureMap(map => {

    map.configureLocation('Village.School', location => {

        location
            .description('asdsa')
            .displayName('sdasd')
            .configureInteractables(interactables => {
    
                interactables.add('door')
                    .on(DefaultConsoleActons.look, () => {
                        return "it's a door";
                    })
                    .on('open', context => {
    
                        if (context.getPlayerProperty('hasSchoolKey')) {
                            context.spawnExitInLocation('Village.School', 'outside')
                                .displayName('Outside')
                                .destination('Village.Square');
    
                            return "The door opens. You can go outside.";
                        } else {
                            return "The door is locked.";
                        }
                    })
    
                interactables.add('window')
                    .on(DefaultConsoleActons.look, () => {
                        return "it's a window";
                    });
    
                interactables.add('cabinet')
                    .on(DefaultConsoleActons.look, () => {
    
                        game.spawnInteractableInLocation('Village.School', 'drawer')
                            .on('open', context => {
    
                                context.spawnItemInLocation('Village.School', 'key', 1)
                                    .onTaken(() => {
                                        context.setPlayerProperty('hasSchoolKey', true);
                                    });
    
                                return "There's a key inside.";
                            });
    
                        return "it's a cabinet";
                    });
            })
            .configureItems((items: any) => {
                
            })
            .configureExits((exits: any) => {
                
            })
    })
});
