import { IGameData, ICartridge } from '../core/shims/textadventurejs.shim';

const cartridge: ICartridge = {
    gameData: {
        commandCounter: 0,
        gameOver: false,
        introText: 'you are teleported in the village\'s school.',
        outroText: 'game is over',
        player: {
            currentLocation: 'Village.School',
            inventory: {}
        },
        map: {
            'Village.School': {
                description: "You're in the village's school. There's a window, a door, and a cabinet.",
                displayName: 'School',
                firstVisit: true,
                interactables: {
                    door: {
                        look: "the door leads outside.",
                        open: () => {

                            if (cartridge.gameData.player.hasKey) {

                                cartridge.gameData.map['Village.School'].exits.outside = {
                                    destination: 'Village.Square',
                                    displayName: 'Outside'
                                };

                                return "The door opens. You can go outside.";
                            } else {
                                return "The door is locked.";
                            }
                        }
                    },
                    window: {
                        look: "the window is baricaded."
                    },
                    cabinet: {
                        look: () => {

                            cartridge.gameData.map['Village.School'].interactables.drawer = {
                                open: () => {

                                    cartridge.gameData.map['Village.School'].items.key = {
                                        description: "an old key. maybe you can use it to open something",
                                        displayName: "key",
                                        hidden: true,
                                        quantity: 1,
                                        use: () => {
                                            return "You use the key";
                                        },
                                        onTaken: () => {
                                            cartridge.gameData.player.hasKey = true;
                                        }
                                    };
        
                                    return "There's a key inside";
                                }
                            }

                            return "an old cabinet with a single drawer.";
                        }
                    }
                },
                items: {},
                exits: {}
            },
            'Village.Square': {
                description: "The village's square",
                displayName: "Village square",
                firstVisit: true
            }
        }
    },
    gameActions: {

    }
};

export = cartridge;
