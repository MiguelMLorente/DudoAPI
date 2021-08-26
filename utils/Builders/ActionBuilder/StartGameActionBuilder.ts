import { Action } from "../../../actionables/Action";
import { StartGameAction } from "../../../actionables/ClientAdminActions/GameManagementActions/StartGameAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
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
        this.game = this.serverData.getGameById(this.jsonAction.actionData.gameId?.valueOf() || '');
    }

    public build(): Action {
        return new StartGameAction(this.requester,
            this.game,
            this.serverData
            )
    }
}