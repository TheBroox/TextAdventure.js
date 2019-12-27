"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var http_server_1 = require("../server/http-server");
var jahmolxesCartridge = __importStar(require("../cartridges/jahmolxes"));
var goldMineCartridge = __importStar(require("../cartridges/gold_mine"));
var server = new http_server_1.ConsoleHttpServer();
server
    .use(express_1.default.static(path_1.default.resolve(path_1.default.join(__dirname, '..', 'terminal'))))
    .registerCartridge('jahmolxes', jahmolxesCartridge)
    .registerCartridge('goldmine', goldMineCartridge)
    .listen();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1zZXJ2ZXIucnVubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3J1bm5lcnMvaHR0cC1zZXJ2ZXIucnVubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE4QjtBQUM5Qiw4Q0FBd0I7QUFDeEIscURBQTBEO0FBRTFELDBFQUE4RDtBQUM5RCx5RUFBNkQ7QUFFN0QsSUFBTSxNQUFNLEdBQUcsSUFBSSwrQkFBaUIsRUFBRSxDQUFDO0FBRXZDLE1BQU07S0FDRCxHQUFHLENBQUMsaUJBQU8sQ0FBQyxNQUFNLENBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3pFLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQztLQUNsRCxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUM7S0FDaEQsTUFBTSxFQUFFLENBQUMifQ==