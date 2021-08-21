"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
function getUser(serverData, id) {
    for (var i = 0; i < serverData.users.length; i++) {
        if (serverData.users[i].Id == id) {
            return serverData.users[i];
        }
    }
    return null;
}
exports.getUser = getUser;
