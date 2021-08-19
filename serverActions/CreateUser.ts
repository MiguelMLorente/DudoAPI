import { Socket } from "socket.io";
import { NormalUser } from "../userData/NormalUser";
import { User } from "../userData/User";

export function createUser(socket: Socket): User {
    let newUser = new NormalUser('');
    socket.send({userId: newUser.Id});
    return newUser;
}