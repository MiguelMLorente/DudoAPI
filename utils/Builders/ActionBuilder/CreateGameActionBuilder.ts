import { Action } from "../../../actionables/Action";
import { CreateGameAction } from "../../../actionables/ClientAdminActions/GameManagementActions/CreateGameAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { NormalUser } from "../../../userData/NormalUser";
import { User } from "../../../userData/User";
import { UserAction } from "./UserAction";

export class CreateGameActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;

    constructor(json: UserAction, serverData: ServerData) {
        this.jsonAction = json;
        this.serverData = serverData;
    }

    public build(): Action {
        return new CreateGameAction(this.getRequester(),
            this.jsonAction.actionData.gameName as String,
            this.jsonAction.actionData.gamePassword as String,
            this.serverData
            )
    }

    public getRequester(): User {
        return new NormalUser("Pau");
    }

    public getGame(): Game {
        return new Game()
    }
}