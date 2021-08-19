"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
var NormalUser_1 = require("../userData/NormalUser");
function createUser(socket) {
    var newUser = new NormalUser_1.NormalUser('');
    socket.send({ userId: newUser.Id });
    return newUser;
}
exports.createUser = createUser;
