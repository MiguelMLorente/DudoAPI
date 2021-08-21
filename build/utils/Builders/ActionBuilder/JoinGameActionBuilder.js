"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGameActionBuilder = void 0;
var JoinGameAction_1 = require("../../../actionables/ClientAdminActions/GameManagementActions/JoinGameAction");
var GameGetter_1 = require("../../Getters/GameGetter");
var JoinGameActionBuilder = /** @class */ (function () {
    function JoinGameActionBuilder(json, serverData, requester) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
        this.requester.setUserName(json.requester.name);
        this.game = GameGetter_1.getGameByName(this.serverData, this.jsonAction.actionData.gameName || '');
    }
    JoinGameActionBuilder.prototype.build = function () {
        return new JoinGameAction_1.JoinGameAction(this.requester, this.jsonAction.actionData.gameName, this.jsonAction.actionData.gamePassword, this.serverData, this.game);
    };
    return JoinGameActionBuilder;
}());
exports.JoinGameActionBuilder = JoinGameActionBuilder;
