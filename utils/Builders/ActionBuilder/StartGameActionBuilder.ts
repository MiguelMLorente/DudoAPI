import { Action } from "../../../actionables/Action";
import { JoinGameAction } from "../../../actionables/ClientAdminActions/GameManagementActions/JoinGameAction";
import { StartGameAction } from "../../../actionables/ClientAdminActions/GameManagementActions/StartGameAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { getGameById } from "../../Getters/GameGetter";
import { UserAction } from "./UserAction";

export class StartGameActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;
    requester: User;
    game: Game;

    constructor(json: UserAction, serverData: ServerData, requester: User) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
        this.game = getGameById(this.serverData, this.jsonAction.actionData.gameId || '');
    }

    public build(): Action {
        return new StartGameAction(this.requester,
            this.game,
            this.serverData
            )
    }
}