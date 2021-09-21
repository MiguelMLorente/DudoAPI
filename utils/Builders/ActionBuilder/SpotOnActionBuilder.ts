import { Action } from "../../../actionables/Action";
import { SpotOnAction } from "../../../actionables/ClientGameActions/SpotOnAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { getGameByName } from "../../Getters/GameGetter";
import { UserAction } from "./UserAction";

export class SpotOnActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;
    requester: User;

    constructor(json: UserAction, serverData: ServerData, requester: User) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
    }

    public build(): Action {
        return new SpotOnAction(this.requester,
            this.serverData,
            this.serverData.getGameById(<string>this.jsonAction.actionData.gameId || ''));
    }
}