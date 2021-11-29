//@ts-nocheck
import { ServerData } from "../../src/ServerData";
import { User } from "../../src/userData/User";

function emptyServerData(): ServerData {
    return new ServerData();
}

function realServerData(): ServerData {
    let serverData: ServerData = new ServerData();

    let user1: User = new User('UserName-1','SocketId-1');
    let user2: User = new User('UserName-2','SocketId-2');
    let user3: User = new User('UserName-3','SocketId-3');
    let user4: User = new User('UserName-4','SocketId-4');

    user1.clientId = "486cae9d-dc1c-4e22-9a76-d0a120442f7d";
    user2.clientId = "b378d887-b05a-402a-b758-afe9399587ef";
    user3.clientId = "44daca2c-4ea7-48c8-9563-b0f12ce6c6f9";
    user4.clientId = "25654461-043c-4697-90bd-d775ed1a4e35";

    serverData.users[user1.clientId] = user1;
    serverData.users[user2.clientId] = user2;
    serverData.users[user3.clientId] = user3;
    serverData.users[user4.clientId] = user4;

    return serverData;
}

export { emptyServerData, realServerData }