//@ts-nocheck
import { ServerData } from "../../src/ServerData";
import { User } from "../../src/userData/User";

function emptyServerData(): ServerData {
    return new ServerData();
}

function realServerData(): ServerData {
    let serverData: ServerData = new ServerData();

    let user1: User = new User('','');
    let user2: User = new User('','');
    let user3: User = new User('','');

    user1.clientId = "486cae9d-dc1c-4e22-9a76-d0a120442f7d";
    user2.clientId = "b378d887-b05a-402a-b758-afe9399587ef";
    user3.clientId = "44daca2c-4ea7-48c8-9563-b0f12ce6c6f9";

    serverData.users[user1.clientId] = user1;
    serverData.users[user2.clientId] = user2;
    serverData.users[user3.clientId] = user3;

    return serverData;
}

export { emptyServerData, realServerData }