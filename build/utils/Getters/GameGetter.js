"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameByName = void 0;
function getGameByName(serverData, name) {
    for (var i = 0; i < serverData.games.length; i++) {
        if (serverData.games[i].name == name) {
            return serverData.games[i];
        }
    }
    return null;
}
exports.getGameByName = getGameByName;
