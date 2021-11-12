import { Action } from "../../../actionables/Action";
import { SetIsPlayerReadyAction } from "../../../actionables/ClientGameActions/SetIsPlayerReadyAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { UserAction } from "./UserAction";

export class SetIsPlayerReadyActionBuilder {
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
        return new SetIsPlayerReadyAction(this.requester,
            this.serverData,
            this.game,
            this.jsonAction.actionData.ready!
            )
    }
}