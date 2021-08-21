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
exports.JoinGameAction = void 0;
var ClientAction_1 = require("../ClientAction");
var JoinGameAction = /** @class */ (function (_super) {
    __extends(JoinGameAction, _super);
    function JoinGameAction(requester, gameName, gamePassword, serverData, joinedGame) {
        var _this = _super.call(this, requester, serverData) || this;
        _this.gameName = gameName;
        _this.gamePassword = gamePassword;
        _this.joinedGame = joinedGame;
        return _this;
    }
    ;
    JoinGameAction.prototype.validate = function () {
        console.log("join game action being validated");
        _super.prototype.validate.call(this);
        // User must not be registered in any game in order to create a new game
        this.isValid = (this.isValid && !this.checkUserRegisteredInGame());
        // Check valid game
        this.isValid = (this.isValid && !(this.joinedGame == null));
        // Check correct password
        this.isValid = (this.isValid && (this.gamePassword === this.joinedGame.gamePassword));
        // Print message
        var message = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    };
    JoinGameAction.prototype.launch = function () {
        console.log("join game action being launched");
        // Add the game creator as the first player of the game and Admin permissions
        this.joinedGame.gameData.addUser(this.requester);
        // Add game Id to the user data set
        this.requester.joinGame(this.joinedGame.gameId);
    };
    JoinGameAction.prototype.checkUserRegisteredInGame = function () {
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
    return JoinGameAction;
}(ClientAction_1.ClientAction));
exports.JoinGameAction = JoinGameAction;
