import { Socket } from "socket.io";
import { ServerData } from "../ServerData";
import { User } from "../userData/User";

export function createUser(socket: Socket, serverData: ServerData): void {
    let newUser = new User('', socket.id);
    serverData.users[newUser.Id.valueOf()] = newUser;
    socket.emit('new-user', {userId: newUser.Id});
}