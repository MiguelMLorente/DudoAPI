"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidActionBuilder = void 0;
var BidAction_1 = require("../../../actionables/ClientGameActions/BidAction");
var Game_1 = require("../../../gameData/Game");
var BidActionBuilder = /** @class */ (function () {
    function BidActionBuilder(json, serverData, requester) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
    }
    BidActionBuilder.prototype.build = function () {
        return new BidAction_1.BidAction(this.requester, this.serverData, this.getGame(), this.jsonAction.actionData.diceQuantity, this.jsonAction.actionData.diceValue);
    };
    BidActionBuilder.prototype.getGame = function () {
        return new Game_1.Game();
    };
    return BidActionBuilder;
}());
exports.BidActionBuilder = BidActionBuilder;
