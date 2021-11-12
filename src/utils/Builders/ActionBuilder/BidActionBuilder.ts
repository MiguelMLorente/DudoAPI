import { Action } from "../../../actionables/Action";
import { BidAction } from "../../../actionables/ClientGameActions/BidAction";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { UserAction } from "./UserAction";

export class BidActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;
    requester: User;

    constructor(json: UserAction, serverData: ServerData, requester: User) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
    }

    public build(): Action {
        return new BidAction(this.requester,
            this.serverData,
            this.serverData.getGameById(<string>this.jsonAction.actionData.gameId || ''),
            this.jsonAction.actionData.diceQuantity!,
            this.jsonAction.actionData.diceValue!)
    }
}