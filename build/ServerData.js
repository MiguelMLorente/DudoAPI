"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerData = void 0;
var ServerData = /** @class */ (function () {
    function ServerData() {
        this.games = [];
        this.users = [];
    }
    ServerData.prototype.getGameById = function (id) {
        try {
            for (var i = 0; i < this.games.length; i++) {
                if (this.games[i].gameId === id)
                    return this.games[i];
            }
            throw new Error("There is no game with the seeked id");
        }
        catch (e) {
            console.log(e);
        }
        return null;
    };
    ServerData.prototype.getUserId = function (id) {
        try {
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].Id === id)
                    return this.users[i];
            }
            throw new Error("There is no user with the seeked id");
        }
        catch (e) {
            console.log(e);
        }
        return null;
    };
    return ServerData;
}());
exports.ServerData = ServerData;
