"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
var User_1 = require("../userData/User");
function createUser(socket) {
    var newUser = new User_1.User('');
    console.log("new user: " + newUser.Id);
    socket.emit('new-user', { userId: newUser.Id });
    return newUser;
}
exports.createUser = createUser;
