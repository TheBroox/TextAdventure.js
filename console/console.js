exports.input = function(input){
	var command = parse(input);
	try {
		return(eval(command.action+'(command)'));
	} catch(error){
		return("I do not know how to " + command.action);
	}
};

function parse(string){
	var components = string.split(' ');
	return {
		action: components[0],
		object: components[1]
	};
}

function go(command){
	return("You go " + command.object);
}