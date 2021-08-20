"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
var NormalUser_1 = require("../userData/NormalUser");
function createUser(socket) {
    var newUser = new NormalUser_1.NormalUser('');
    console.log("new user: " + newUser.Id);
    socket.emit('new-user', { userId: newUser.Id });
    return newUser;
}
exports.createUser = createUser;
