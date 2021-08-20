"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameData = void 0;
var crypto_1 = require("crypto");
var GameStatus_1 = require("../utils/GameStatus");
var GameData = /** @class */ (function () {
    function GameData(name, password) {
        this.id = crypto_1.randomUUID();
        this.playerList = [];
        this.gameStatus = GameStatus_1.GameStatus.NOT_STARTED;
        this.gameHistory = [];
        this.gameName = name || '';
        this.gamePassword = password || '';
    }
    Object.defineProperty(GameData.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: false,
        configurable: true
    });
    GameData.prototype.addUser = function (user) {
        this.playerList.push(user);
    };
    return GameData;
}());
exports.GameData = GameData;
