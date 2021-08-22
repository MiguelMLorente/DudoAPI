import { Socket } from "socket.io";
import { User } from "../userData/User";

export function createUser(socket: Socket): User {
    let newUser = new User('',socket);
    console.log("new user: " + newUser.Id);
    socket.emit('new-user', {userId: newUser.Id});
    return newUser;
}