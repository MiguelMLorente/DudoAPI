import { Action } from "../../../actionables/Action";
import { CallAction } from "../../../actionables/ClientGameActions/CallAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { getGameByName } from "../../Getters/GameGetter";
import { UserAction } from "./UserAction";

export class CallActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;
    requester: User;

    constructor(json: UserAction, serverData: ServerData, requester: User) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
    }

    public build(): Action {
        return new CallAction(this.requester,
            this.serverData,
            this.getGame());
    }

    public getGame(): Game {
        return getGameByName(this.serverData, "asdf");
    }
}