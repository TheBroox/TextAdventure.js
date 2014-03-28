$(function(){
	// ===== Onload Functions ============================================================
	displayResize();

	// ===== Event Handlers ==============================================================
	// ----- Input Submit ----------------------------------------------------------------
	$('#console').submit(function(event) {
		event.preventDefault();
		var inputString = $('#input').val();
		inputString = inputString.trim();
		$('#input').val('');
		toScreen(inputString,'user');
		if(inputString !== ''){
			inputBuffer.push(inputString);
			messageServer(inputString);
		}
		inputBufferIndex = inputBuffer.length;
	});
	// ----- Input Buffer ----------------------------------------------------------------
	var inputBuffer = [];
	var inputBufferIndex = 0;
	$(document).keydown(function(e) {
		switch(e.which) {
			case 38: // up
				if(inputBufferIndex>0){
					--inputBufferIndex;
				}
				$('#input').val(inputBuffer[inputBufferIndex]);
				break;
			case 40: // down
				if(inputBufferIndex<inputBuffer.length){
					++inputBufferIndex;
				}
				$('#input').val(inputBuffer[inputBufferIndex]);
				break;
			default: return;
		}
		e.preventDefault();
	});
	$(window).resize(function(){
		displayResize();
	});
});

// ===== Functions ======================================================================
function messageServer(message){
	$.post('http://localhost:3000', {"input": message}, function(data) {
		toScreen(data.response,'console');
	});
}
// ----- Insure Terminal Appearence -----------------------------------------------------
function displayResize(){
	$('#display').height($(window).height()-30);
	$('#display').scrollTop($('#display')[0].scrollHeight);
}
// ----- Write to Screen ----------------------------------------------------------------
function toScreen(message, actor){
	if(actor == 'user'){
		message = '> ' + message;
	}
	var displayString = $('#display').val() + message + '\n';
	$('#display').val(displayString);
	$('#display').scrollTop($('#display')[0].scrollHeight);
}