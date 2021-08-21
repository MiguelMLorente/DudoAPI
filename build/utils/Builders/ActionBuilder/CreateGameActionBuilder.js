"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameActionBuilder = void 0;
var CreateGameAction_1 = require("../../../actionables/ClientAdminActions/GameManagementActions/CreateGameAction");
var Game_1 = require("../../../gameData/Game");
var CreateGameActionBuilder = /** @class */ (function () {
    function CreateGameActionBuilder(json, serverData, requester) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
        this.requester.setUserName(json.requester.name);
    }
    CreateGameActionBuilder.prototype.build = function () {
        return new CreateGameAction_1.CreateGameAction(this.requester, this.jsonAction.actionData.gameName, this.jsonAction.actionData.gamePassword, this.serverData);
    };
    CreateGameActionBuilder.prototype.getGame = function () {
        return new Game_1.Game();
    };
    return CreateGameActionBuilder;
}());
exports.CreateGameActionBuilder = CreateGameActionBuilder;
