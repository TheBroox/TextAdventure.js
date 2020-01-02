import { DefaultConsoleActons } from "../core/shims/textadventurejs.shim";

const game: any = {};

// mockup of the future cartridge definition system
game.createLocation('Village.School', (location: any) => {

    location
        .description('asdsa')
        .displayName('sdasd')
        .interactables((interactables: any) => {

            interactables.add('door')
                .interact(DefaultConsoleActons.look, () => {
                    return "it's a door";
                })
                .interact('open', () => {

                    if (game.player.getProperty('hasSchoolKey')) {
                        location.addExit('outside')
                            .displayName('Outside')
                            .destination('Village.Square');

                        return "The door opens. You can go outside.";
                    } else {
                        return "The door is locked.";
                    }
                })

            interactables.add('window')
                .interact(DefaultConsoleActons.look, () => {
                    return "it's a window";
                });

            interactables.add('cabinet')
                .interact(DefaultConsoleActons.look, () => {

                    game.spawnInteractable('Village.School', 'drawer')
                        .interact('open', () => {

                            game.spawnItem('Village.School', 'key', 1)
                                .onTaken(() => {
                                    game.player.setProperty('hasSchoolKey', true);
                                });

                            return "There's a key inside.";
                        });

                    return "it's a cabinet";
                });
        })
        .items((items: any) => {
            
        })
        .exits((exits: any) => {
            
        })
})