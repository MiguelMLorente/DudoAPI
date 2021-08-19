"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaiseActionBuilder = void 0;
var RaiseAction_1 = require("../../../actionables/ClientGameActions/RaiseAction");
var Game_1 = require("../../../gameData/Game");
var NormalUser_1 = require("../../../userData/NormalUser");
var RaiseActionBuilder = /** @class */ (function () {
    function RaiseActionBuilder(json) {
        this.jsonAction = json;
    }
    RaiseActionBuilder.prototype.build = function () {
        return new RaiseAction_1.RaiseAction(this.getRequester(), this.getGame());
    };
    RaiseActionBuilder.prototype.getRequester = function () {
        return new NormalUser_1.NormalUser("Pau");
    };
    RaiseActionBuilder.prototype.getGame = function () {
        return new Game_1.Game();
    };
    return RaiseActionBuilder;
}());
exports.RaiseActionBuilder = RaiseActionBuilder;
