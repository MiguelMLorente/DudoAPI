import { Socket } from "socket.io";
import { NormalUser } from "../userData/NormalUser";
import { User } from "../userData/User";

export function createUser(socket: Socket): User {
    let newUser = new NormalUser('');
    console.log("new user!: " + newUser.Id);
    socket.send({userId: newUser.Id});
    return newUser;
}