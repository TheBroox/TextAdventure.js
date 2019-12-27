$(function () {
    // ===== Onload Functions ===========================================================
    displayResize();
    messageServer('get games');
    // ===== Event Handlers =============================================================
    // ----- Input Submit ---------------------------------------------------------------
    $('#console').submit(function (event) {
        event.preventDefault();
        var inputString = '' + $('#input').val();
        inputString = inputString.trim();
        $('#input').val('');
        toScreen(inputString, 'user');
        if (inputString !== '') {
            messageServer(inputString);
            if (inputString !== inputBuffer[inputBuffer.length - 1]) {
                inputBuffer.push(inputString);
            }
        }
        inputBufferIndex = inputBuffer.length;
    });
    // ----- Input Buffer ---------------------------------------------------------------
    var inputBuffer = [];
    var inputBufferIndex = 0;
    $(document).keydown(function (event) {
        switch (event.which) {
            case 38: // up
                if (inputBufferIndex > 0) {
                    --inputBufferIndex;
                }
                $('#input').val(inputBuffer[inputBufferIndex]);
                break;
            case 40: // down
                if (inputBufferIndex < inputBuffer.length) {
                    ++inputBufferIndex;
                }
                $('#input').val(inputBuffer[inputBufferIndex]);
                break;
            default: return;
        }
        event.preventDefault();
    });
    // ----- Window Resize Listener -----------------------------------------------------
    $(window).resize(function () {
        displayResize();
    });
});
// ===== Functions ======================================================================
// ----- Send Message to Server ---------------------------------------------------------
function messageServer(message) {
    $.post(window.location.href + 'console', { "input": message }, function (data) {
        toScreen(data.response, 'console');
    }).fail(function () {
        toScreen('Unable to reach server.', 'terminal');
    });
}
// ----- Insure Terminal Appearance -----------------------------------------------------
function displayResize() {
    $('#display').height($(window).height() - 30);
    $('#display').scrollTop($('#display')[0].scrollHeight);
}
// ----- Write to Screen ----------------------------------------------------------------
function toScreen(message, actor) {
    if (actor == 'user') {
        message = '> ' + message;
    }
    var displayString = $('#display').val() + message + '\n';
    $('#display').val(displayString);
    $('#display').scrollTop($('#display')[0].scrollHeight);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXJtaW5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLENBQUM7SUFDRCxxRkFBcUY7SUFDckYsYUFBYSxFQUFFLENBQUM7SUFDaEIsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRTNCLHFGQUFxRjtJQUNyRixxRkFBcUY7SUFDckYsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFTLEtBQVU7UUFDdkMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksV0FBVyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDekMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BCLFFBQVEsQ0FBQyxXQUFXLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBRyxXQUFXLEtBQUssRUFBRSxFQUFDO1lBQ3JCLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQixJQUFHLFdBQVcsS0FBSyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsRUFBQztnQkFDcEQsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUM5QjtTQUNEO1FBQ0QsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNILHFGQUFxRjtJQUNyRixJQUFJLFdBQVcsR0FBVSxFQUFFLENBQUM7SUFDNUIsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUs7UUFDakMsUUFBTyxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ25CLEtBQUssRUFBRSxFQUFFLEtBQUs7Z0JBQ2IsSUFBRyxnQkFBZ0IsR0FBQyxDQUFDLEVBQUM7b0JBQ3JCLEVBQUUsZ0JBQWdCLENBQUM7aUJBQ25CO2dCQUNELENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDL0MsTUFBTTtZQUNQLEtBQUssRUFBRSxFQUFFLE9BQU87Z0JBQ2YsSUFBRyxnQkFBZ0IsR0FBQyxXQUFXLENBQUMsTUFBTSxFQUFDO29CQUN0QyxFQUFFLGdCQUFnQixDQUFDO2lCQUNuQjtnQkFDRCxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLE1BQU07WUFDUCxPQUFPLENBQUMsQ0FBQyxPQUFPO1NBQ2hCO1FBQ0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBQ0gscUZBQXFGO0lBQ3JGLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDaEIsYUFBYSxFQUFFLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILHlGQUF5RjtBQUN6Rix5RkFBeUY7QUFDekYsU0FBUyxhQUFhLENBQUMsT0FBWTtJQUNsQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFDLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsRUFBRSxVQUFTLElBQUk7UUFDdkUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1AsUUFBUSxDQUFDLHlCQUF5QixFQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUNELHlGQUF5RjtBQUN6RixTQUFTLGFBQWE7SUFDckIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUNELHlGQUF5RjtBQUN6RixTQUFTLFFBQVEsQ0FBQyxPQUFZLEVBQUUsS0FBVTtJQUN6QyxJQUFHLEtBQUssSUFBSSxNQUFNLEVBQUM7UUFDbEIsT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUM7S0FDekI7SUFDRCxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN6RCxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hELENBQUMifQ==