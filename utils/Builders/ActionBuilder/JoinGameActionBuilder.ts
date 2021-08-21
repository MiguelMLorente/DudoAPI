import { Action } from "../../../actionables/Action";
import { JoinGameAction } from "../../../actionables/ClientAdminActions/GameManagementActions/JoinGameAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { getGameByName } from "../../Getters/GameGetter";
import { UserAction } from "./UserAction";

export class JoinGameActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;
    requester: User;
    game: Game;

    constructor(json: UserAction, serverData: ServerData, requester: User) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
        this.requester.setUserName(json.requester.name);
        this.game = getGameByName(this.serverData, this.jsonAction.actionData.gameName || '');
    }

    public build(): Action {
        return new JoinGameAction(this.requester,
            this.jsonAction.actionData.gameName as String,
            this.jsonAction.actionData.gamePassword as String,
            this.serverData,
            this.game
            )
    }
}