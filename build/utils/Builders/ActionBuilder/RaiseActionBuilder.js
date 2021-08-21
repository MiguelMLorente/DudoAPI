"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaiseActionBuilder = void 0;
var RaiseAction_1 = require("../../../actionables/ClientGameActions/RaiseAction");
var Game_1 = require("../../../gameData/Game");
var RaiseActionBuilder = /** @class */ (function () {
    function RaiseActionBuilder(json, serverData, requester) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
    }
    RaiseActionBuilder.prototype.build = function () {
        return new RaiseAction_1.RaiseAction(this.requester, this.serverData, this.getGame());
    };
    RaiseActionBuilder.prototype.getGame = function () {
        return new Game_1.Game();
    };
    return RaiseActionBuilder;
}());
exports.RaiseActionBuilder = RaiseActionBuilder;
