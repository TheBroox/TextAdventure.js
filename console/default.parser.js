"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultParser = /** @class */ (function () {
    function DefaultParser() {
    }
    DefaultParser.prototype.parse = function (string) {
        var skipWords = ['', 'a', 'an', 'at', 'in', 'on', 'the', 'to'];
        var subjectEndWords = ['on', 'with', 'and'];
        // === Prep Input for Processing ===
        var components = string.toLowerCase().split(' ');
        // === Create Necessary Variables ===
        var command = {
            action: '',
            subject: '',
            object: ''
        };
        var subjectStartIndex;
        var objectStartIndex;
        // === Determine Action ===
        command.action = components[0];
        // === Determine Subject Start ===
        for (var i = 1; i < components.length; ++i) {
            if (skipWords.indexOf(components[i]) === -1) {
                command.subject = components[i];
                subjectStartIndex = i;
                break;
            }
        }
        // === Determine Subject End and Object Start ===
        for (var i = subjectStartIndex + 1; i < components.length; ++i) {
            if (subjectEndWords.indexOf(components[i]) !== -1) {
                command.object = '';
                objectStartIndex = i + 1;
                break;
            }
            else if (components[i] === '') {
                continue;
            }
            else {
                command.subject = command.subject.concat(' ' + components[i]);
            }
        }
        // === Determine End of Object ===
        for (var i = objectStartIndex + 1; i < components.length; ++i) {
            if (skipWords.indexOf(components[i]) === -1) {
                if (command.object === '') {
                    command.object = command.object.concat(components[i]);
                }
                else {
                    command.object = command.object.concat(' ' + components[i]);
                }
            }
        }
        return command;
    };
    return DefaultParser;
}());
exports.DefaultParser = DefaultParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZWZhdWx0LnBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBO0lBQUE7SUF3REEsQ0FBQztJQXREQSw2QkFBSyxHQUFMLFVBQU0sTUFBYztRQUVuQixJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLGVBQWUsR0FBRyxDQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUMsb0NBQW9DO1FBQ3BDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakQscUNBQXFDO1FBQ3JDLElBQUksT0FBTyxHQUFhO1lBQ3ZCLE1BQU0sRUFBRSxFQUFFO1lBQ1YsT0FBTyxFQUFFLEVBQUU7WUFDWCxNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFFRixJQUFJLGlCQUFpQixDQUFDO1FBQ3RCLElBQUksZ0JBQWdCLENBQUM7UUFFckIsMkJBQTJCO1FBQzNCLE9BQU8sQ0FBQyxNQUFNLEdBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhDLGtDQUFrQztRQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBQztZQUN4QyxJQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7Z0JBQzFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU07YUFDTjtTQUNEO1FBQ0QsaURBQWlEO1FBQ2pELEtBQUssSUFBSSxDQUFDLEdBQUMsaUJBQWlCLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDO1lBQzFELElBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztnQkFDaEQsT0FBTyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLGdCQUFnQixHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU07YUFDTjtpQkFBTSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ2hDLFNBQVM7YUFDVDtpQkFBTTtnQkFDTixPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM1RDtTQUNEO1FBQ0Qsa0NBQWtDO1FBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUMsZ0JBQWdCLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDO1lBQ3ZELElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDNUMsSUFBRyxPQUFPLENBQUMsTUFBTSxLQUFLLEVBQUUsRUFBQztvQkFDeEIsT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEQ7cUJBQU07b0JBQ04sT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzFEO2FBQ0Q7U0FDRDtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2hCLENBQUM7SUFFRixvQkFBQztBQUFELENBQUMsQUF4REQsSUF3REM7QUF4RFksc0NBQWEifQ==