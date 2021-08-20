"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameActionBuilder = void 0;
var CreateGameAction_1 = require("../../../actionables/ClientAdminActions/GameManagementActions/CreateGameAction");
var Game_1 = require("../../../gameData/Game");
var NormalUser_1 = require("../../../userData/NormalUser");
var CreateGameActionBuilder = /** @class */ (function () {
    function CreateGameActionBuilder(json, serverData) {
        this.jsonAction = json;
        this.serverData = serverData;
    }
    CreateGameActionBuilder.prototype.build = function () {
        return new CreateGameAction_1.CreateGameAction(this.getRequester(), this.jsonAction.actionData.gameName, this.jsonAction.actionData.gamePassword, this.serverData);
    };
    CreateGameActionBuilder.prototype.getRequester = function () {
        return new NormalUser_1.NormalUser("Pau");
    };
    CreateGameActionBuilder.prototype.getGame = function () {
        return new Game_1.Game();
    };
    return CreateGameActionBuilder;
}());
exports.CreateGameActionBuilder = CreateGameActionBuilder;
