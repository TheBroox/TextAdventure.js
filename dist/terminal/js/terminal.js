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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVybWluYWwvanMvdGVybWluYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxDQUFDO0lBQ0QscUZBQXFGO0lBQ3JGLGFBQWEsRUFBRSxDQUFDO0lBQ2hCLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUUzQixxRkFBcUY7SUFDckYscUZBQXFGO0lBQ3JGLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBUyxLQUFVO1FBQ3ZDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixJQUFJLFdBQVcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3pDLFdBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQixRQUFRLENBQUMsV0FBVyxFQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQUcsV0FBVyxLQUFLLEVBQUUsRUFBQztZQUNyQixhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0IsSUFBRyxXQUFXLEtBQUssV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEVBQUM7Z0JBQ3BELFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDOUI7U0FDRDtRQUNELGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDSCxxRkFBcUY7SUFDckYsSUFBSSxXQUFXLEdBQVUsRUFBRSxDQUFDO0lBQzVCLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLO1FBQ2pDLFFBQU8sS0FBSyxDQUFDLEtBQUssRUFBRTtZQUNuQixLQUFLLEVBQUUsRUFBRSxLQUFLO2dCQUNiLElBQUcsZ0JBQWdCLEdBQUMsQ0FBQyxFQUFDO29CQUNyQixFQUFFLGdCQUFnQixDQUFDO2lCQUNuQjtnQkFDRCxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLE1BQU07WUFDUCxLQUFLLEVBQUUsRUFBRSxPQUFPO2dCQUNmLElBQUcsZ0JBQWdCLEdBQUMsV0FBVyxDQUFDLE1BQU0sRUFBQztvQkFDdEMsRUFBRSxnQkFBZ0IsQ0FBQztpQkFDbkI7Z0JBQ0QsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNO1lBQ1AsT0FBTyxDQUFDLENBQUMsT0FBTztTQUNoQjtRQUNELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztJQUNILHFGQUFxRjtJQUNyRixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2hCLGFBQWEsRUFBRSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCx5RkFBeUY7QUFDekYseUZBQXlGO0FBQ3pGLFNBQVMsYUFBYSxDQUFDLE9BQVk7SUFDbEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBQyxTQUFTLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLEVBQUUsVUFBUyxJQUFJO1FBQ3ZFLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNQLFFBQVEsQ0FBQyx5QkFBeUIsRUFBQyxVQUFVLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztBQUNKLENBQUM7QUFDRCx5RkFBeUY7QUFDekYsU0FBUyxhQUFhO0lBQ3JCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFDRCx5RkFBeUY7QUFDekYsU0FBUyxRQUFRLENBQUMsT0FBWSxFQUFFLEtBQVU7SUFDekMsSUFBRyxLQUFLLElBQUksTUFBTSxFQUFDO1FBQ2xCLE9BQU8sR0FBRyxJQUFJLEdBQUcsT0FBTyxDQUFDO0tBQ3pCO0lBQ0QsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDekQsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN4RCxDQUFDIn0=