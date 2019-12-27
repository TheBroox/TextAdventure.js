"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_session_1 = __importDefault(require("express-session"));
var console_1 = __importDefault(require("../console/console"));
var ConsoleHttpServer = /** @class */ (function () {
    function ConsoleHttpServer(options) {
        this._options = {};
        this._middleware = [];
        this._cartridges = {};
        if (options) {
            this._options = options;
        }
    }
    ConsoleHttpServer.prototype.configure = function () {
        var _this = this;
        var consoleApiPath = this._options.consoleApiPath || '/console';
        this._app = express_1.default();
        this._app.use(body_parser_1.default.json());
        this._app.use(body_parser_1.default.urlencoded({ extended: true }));
        if (this._middleware) {
            this._middleware.forEach(function (toUse) {
                _this._app.use(toUse);
            });
        }
        this._app.use(express_session_1.default({ secret: '1234567890QWERTY', resave: false, saveUninitialized: true }));
        var con = console_1.default();
        if (this._cartridges) {
            Object.keys(this._cartridges).forEach(function (cartridgeName) {
                con.registerCartridge(cartridgeName, _this._cartridges[cartridgeName]);
            });
        }
        this._app.post(consoleApiPath, function (req, res) {
            res.json({ response: con.input(req.body.input, req.session.id) });
        });
    };
    ConsoleHttpServer.prototype.use = function (middleware) {
        this._middleware.push(middleware);
        return this;
    };
    ConsoleHttpServer.prototype.registerCartridge = function (name, cartridge) {
        this._cartridges[name] = cartridge;
        return this;
    };
    ConsoleHttpServer.prototype.listen = function () {
        this.configure();
        var port = this._options.port || 3000;
        var ipAddress = this._options.ipAddress || '127.0.0.1';
        this._app.listen(port, ipAddress, function () {
            console.log("Listening on " + ipAddress + ", server_port " + port);
        });
    };
    return ConsoleHttpServer;
}());
exports.ConsoleHttpServer = ConsoleHttpServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1zZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmVyL2h0dHAtc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTJDO0FBRzNDLDREQUFxQztBQUNyQyxvRUFBc0M7QUFDdEMsK0RBQStDO0FBVy9DO0lBT0UsMkJBQVksT0FBd0I7UUFMNUIsYUFBUSxHQUFvQixFQUFFLENBQUM7UUFPckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFFdEIsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFTyxxQ0FBUyxHQUFqQjtRQUFBLGlCQTRCQztRQTFCQyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsSUFBSSxVQUFVLENBQUM7UUFFbEUsSUFBSSxDQUFDLElBQUksR0FBRyxpQkFBTyxFQUFFLENBQUM7UUFFdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6RCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO2dCQUM1QixLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMseUJBQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUU3RixJQUFNLEdBQUcsR0FBRyxpQkFBYSxFQUFFLENBQUM7UUFFNUIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLGFBQWE7Z0JBQ2pELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsVUFBUyxHQUFHLEVBQUMsR0FBRztZQUM3QyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sK0JBQUcsR0FBVixVQUFXLFVBQW1CO1FBRTVCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWxDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLDZDQUFpQixHQUF4QixVQUF5QixJQUFZLEVBQUUsU0FBcUI7UUFFMUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7UUFFbkMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sa0NBQU0sR0FBYjtRQUVFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVqQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7UUFDeEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLElBQUksV0FBVyxDQUFDO1FBRXpELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxlQUFlLEdBQUcsU0FBUyxHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQXhFRCxJQXdFQztBQXhFWSw4Q0FBaUIifQ==