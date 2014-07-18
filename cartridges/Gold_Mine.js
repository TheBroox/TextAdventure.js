// === Game Data ===
var cartridge = {
	commandCounter : 0,
	introText : 'Welcome to the Crooked Gulch Gold Mine. What it lacks in safety precautions it more than makes up for in gold. Watch your step an you might just make it out with riches beyond your wildest imagination!',
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
				helmet : {
					look : 'It is a pile of miner helmets with lights on them. They seem to still be operational.',
					take : function(){
						itemCap('helmet',2);
					}
				},
				sign : { look : 'The sign reads "Crooked Gulch Gold Mine" and has a note taked to the bottom of it.'},
				note : { look : 'Written in an untidy scroll the note reads "Generator blew. Lights out."'}
			},
			items : {
				helmet : {
					displayName : 'Miner Helmet',
					description : 'This trusty old miner helment is covered in dents but still seems sturdy. Plus, the light works.',
					quantity : 1,
					hidden : true
				}
			},
			exits : {}
		}
	}
};

// === External Access to Game Data ===
module.exports.cartridge = cartridge;

// === Game Unique Functions ===
function itemCap(item, number){
	// To come
}