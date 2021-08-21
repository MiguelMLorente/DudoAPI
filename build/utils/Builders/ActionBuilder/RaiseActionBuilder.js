"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaiseActionBuilder = void 0;
var RaiseAction_1 = require("../../../actionables/ClientGameActions/RaiseAction");
var GameGetter_1 = require("../../Getters/GameGetter");
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
        return GameGetter_1.getGameByName(this.serverData, "asdf");
    };
    return RaiseActionBuilder;
}());
exports.RaiseActionBuilder = RaiseActionBuilder;
