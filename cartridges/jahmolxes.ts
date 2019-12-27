import { ICartridge, ICommand, ConsoleInterfaceFn, IGameData } from "../shims/textadventurejs.shim";

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
        vomit: (gameData: IGameData, command: ICommand, consoleInterface: ConsoleInterfaceFn) => {
            return `Ai borat cu succes pe ${command.subject}`;
        },
        burp: (gameData: IGameData, command: ICommand) => {

            gameData.player.burpCounter = gameData.player.burpCounter || 0;

            return `You burped ${++gameData.player.burpCounter} times until now`;
        }
    }
};

export = cartridge;
