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
        var _this = _super.call(this, requester, serverData) || this;
        _this.gameName = gameName;
        _this.gamePassword = gamePassword;
        return _this;
    }
    ;
    CreateGameAction.prototype.validate = function () {
        console.log("create game action being validated");
        _super.prototype.validate.call(this);
        // Game name must not be empty
        this.isValid = (this.isValid && (this.gameName !== ""));
        // User must not be registered in any game in order to create a new game
        this.isValid = (this.isValid && !this.checkUserRegisteredInGame());
        // Print message
        var message = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    };
    CreateGameAction.prototype.launch = function () {
        console.log("create game action being launched");
        // Create new game with the given name and password
        var game = new Game_1.Game(this.gameName, this.gamePassword);
        // Add the game creator as the first player of the game and Admin permissions
        game.gameData.addUser(this.requester);
        this.requester.grantAdminPermisions();
        // Add the game to the game list in the server data base
        this.serverData.games.push(game);
    };
    CreateGameAction.prototype.checkUserRegisteredInGame = function () {
        var _this = this;
        // Checks if the user is registered in any game in the server
        var foundUser = false;
        this.serverData.games.forEach(function (game) {
            if (foundUser)
                return;
            game.users.forEach(function (user) {
                if (user.Id === _this.requester.Id) {
                    foundUser = true;
                    return;
                }
            });
        });
        return foundUser;
    };
    return CreateGameAction;
}(ClientAction_1.ClientAction));
exports.CreateGameAction = CreateGameAction;
