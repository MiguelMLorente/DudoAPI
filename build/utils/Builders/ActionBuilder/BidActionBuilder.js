"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidActionBuilder = void 0;
var BidAction_1 = require("../../../actionables/ClientGameActions/BidAction");
var Game_1 = require("../../../gameData/Game");
var NormalUser_1 = require("../../../userData/NormalUser");
var BidActionBuilder = /** @class */ (function () {
    function BidActionBuilder(json) {
        this.jsonAction = json;
    }
    BidActionBuilder.prototype.build = function () {
        return new BidAction_1.BidAction(this.getRequester(), this.getGame(), this.jsonAction.actionData.diceQuantity, this.jsonAction.actionData.diceValue);
    };
    BidActionBuilder.prototype.getRequester = function () {
        return new NormalUser_1.NormalUser("Pau");
    };
    BidActionBuilder.prototype.getGame = function () {
        return new Game_1.Game();
    };
    return BidActionBuilder;
}());
exports.BidActionBuilder = BidActionBuilder;
