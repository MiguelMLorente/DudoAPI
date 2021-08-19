"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameData = void 0;
var crypto_1 = require("crypto");
var GameStatus_1 = require("../utils/GameStatus");
var GameData = /** @class */ (function () {
    function GameData() {
        this.id = crypto_1.randomUUID();
        this.playerList = [];
        this.gameStatus = GameStatus_1.GameStatus.NOT_STARTED;
        this.gameHistory = [];
    }
    Object.defineProperty(GameData.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: false,
        configurable: true
    });
    return GameData;
}());
exports.GameData = GameData;
