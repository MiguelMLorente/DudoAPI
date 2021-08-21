import { Action } from "../../../actionables/Action";
import { CreateGameAction } from "../../../actionables/ClientAdminActions/GameManagementActions/CreateGameAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { NormalUser } from "../../../userData/NormalUser";
import { User } from "../../../userData/User";
import { getUser } from "../../Getters/UserGetter";
import { UserAction } from "./UserAction";

export class CreateGameActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;
    requester: User;

    constructor(json: UserAction, serverData: ServerData, requester: User) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
        this.requester.setUserName(json.requester.name);
    }

    public build(): Action {
        return new CreateGameAction(this.requester,
            this.jsonAction.actionData.gameName as String,
            this.jsonAction.actionData.gamePassword as String,
            this.serverData
            )
    }

    public getGame(): Game {
        return new Game()
    }
}