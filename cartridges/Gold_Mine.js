// === Game Data ===
exports.gameData = {
	commandCounter : 0,
	introText : 'Welcome to the Crooked Gulch Gold Mine. What it lacks in safety precautions it more than makes up for in gold. Watch your step and you might just make it out with riches beyond your wildest imagination!',
	player : {
		currentLocation : 'MineEntrance',
		inventory : {}
	},
	map : {
		'MineEntrance' : {
			firstVisit : true,
			displayName : 'Mine Entrance',
			description : 'You stand at the partially collapsed entrance to the mine. Nearby there is a sign sticking out of a pile of miner helmets.',
			interactables : {
				helmets : { look : 'It is a pile of miner helmets with lights on them. They seem to still be operational.' },
				sign : { look : 'The sign reads "Crooked Gulch Gold Mine" and has a note tacked to the bottom of it.'},
				note : {
					look : 'Written in an untidy scroll the note reads "Generator blew. Lights out."',
					test : function(){
						return testFunction();
					}
				}
			},
			items : {
				helmet : {
					displayName : 'Miner Helmet',
					description : 'A trusty old miner helmet covered in minor dents. Still seems sturdy and the light works.',
					use : function(){
						return "You're doing it Peter!";
					},
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
			setup : function(){
				
			},
			teardown : function(){
				
			},
			updateLocation : function(command){
				return testFunction();
			}
		},
		'Tunnel' : {
			firstVisit : true,
			displayName : 'Tunnel',
			description : 'It is exceedingly dark in here.',
			exits : {
				outside : {
					displayName : 'Outside',
					destination : 'MineEntrance'
				}
			}
		}

	}
};

// === Game Functions ===
exports.gameFunctions = {
	take : function(game, command, consoleInterface){
		return 'Cart: '+consoleInterface(game, command);
	},
	test : function(game, command, consoleInterface){
		return 'This is a test.';
	}
}

// === Helper Functions ===
function testFunction(){
	return gameFunctions.test();
}