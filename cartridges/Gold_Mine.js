// === Game Data ===
var gameData = {
	commandCounter : 0,
	gameOver : false,
	introText : 'Welcome to the Crooked Gulch Gold Mine. What it lacks in safety precautions it more than makes up for in gold. Watch your step and you might just make it out with riches beyond your wildest imagination!',
	outroText : 'Thanks For playing!',
	player : {
		currentLocation : 'MineEntrance',
		inventory : {},
		lightSource : false
	},
	map : {
		'MineEntrance' : {
			firstVisit : true,
			displayName : 'Mine Entrance',
			description : 'You stand at the partially collapsed entrance to the mine. Nearby there is a sign sticking out of a pile of miner helmets.',
			interactables : {
				helmets : { look : 'It is a pile of miner helmets with lights on them. They seem to still be operational.' },
				sign : { look : 'The sign reads "Crooked Gulch Gold Mine" and has a note tacked to the bottom of it.' },
				note : { look : 'Written in an untidy scroll the note reads "Generator blew. Lights out."' }
			},
			items : {
				helmet : {
					displayName : 'Miner Helmet',
					description : 'A trusty old miner helmet covered in minor dents. Still seems sturdy and the light works.',
					use : function(){return useLightSource();},
					quantity : 1,
					hidden : true
				}
			},
			exits : {
				inside : {
					displayName : 'Inside',
					destination : 'Tunnel'
				}
			},
		},
		'Tunnel' : {
			firstVisit : true,
			displayName : 'Tunnel',
			description : 'It is dimly lit here and look much darker further back.',
			exits : {
				outside : {
					displayName : 'Outside',
					destination : 'MineEntrance'
				},
				deeper : {
					displayName : 'Deeper',
					destination : 'End'
				}
			}
		},
		'End' : {
			firstVisit : true,
			description : 'placeholder',
			setup : function(){end();}
		}
	}
};

// === Game Actions ===
var gameActions = {
	die : function(game, command, consoleInterface){
		if(hasGameEnded()){

		} else {
			return consoleInterface(game, command);
		}
	}
}

// === Necessary Exports ===
module.exports.gameData = gameData;
module.exports.gameActions = gameActions;

// === Helper Functions ===
function end(){
	if(gameData.player.lightSource){
		gameData.map['End'].description = 'You found more gold than you can carry.';
	} else {
		gameData.map['End'].description = 'It is so dark, you can\'t see anything! You fall down an unseen crevice. Your body is never recovered.';
	}
	gameData.gameOver = true;
}

function useLightSource(){
	gameData.player.lightSource = true;
	return 'You click on the light attached to the helemt.'
}