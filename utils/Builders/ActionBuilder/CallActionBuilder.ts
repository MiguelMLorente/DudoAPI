import { Action } from "../../../actionables/Action";
import { CallAction } from "../../../actionables/ClientGameActions/CallAction";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
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
            this.serverData.getGameById(<string>this.jsonAction.actionData.gameId || ''));
    }
}