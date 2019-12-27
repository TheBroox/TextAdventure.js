import { ICartridge } from "../shims/textadventurejs.shim";

const cartridge: ICartridge = {
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
                setup: () => {
                    cartridge.gameData.map['end'].description = 's-a terminat prostule';
                    cartridge.gameData.gameOver = true;
                }
            }
        }
    },
    gameActions: {
        
    }
};

export = cartridge;
