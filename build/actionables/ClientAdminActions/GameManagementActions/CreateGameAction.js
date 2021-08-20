"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameAction = void 0;
var Game_1 = require("../../../gameData/Game");
var ClientAction_1 = require("../ClientAction");
var CreateGameAction = /** @class */ (function (_super) {
    __extends(CreateGameAction, _super);
    function CreateGameAction(requester, gameName, gamePassword, serverData) {
        var _this = _super.call(this, serverData) || this;
        _this.requester = requester;
        _this.gameName = gameName;
        _this.gamePassword = gamePassword;
        return _this;
    }
    ;
    CreateGameAction.prototype.validate = function () {
        console.log("action being validated");
        _super.prototype.validate.call(this);
        var message = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    };
    CreateGameAction.prototype.launch = function () {
        console.log("action being launched");
        var game = new Game_1.Game(this.gameName, this.gamePassword);
        game.gameData.addUser(this.requester);
        this.serverData.games.push(game);
    };
    return CreateGameAction;
}(ClientAction_1.ClientAction));
exports.CreateGameAction = CreateGameAction;
