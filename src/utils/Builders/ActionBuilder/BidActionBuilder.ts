import { Action } from "../../../actionables/Action";
import { BidAction } from "../../../actionables/ClientGameActions/BidAction";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { UserAction } from "./UserAction";

export class BidActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;

    constructor(json: UserAction, helper: ServerDataHelper) {
        this.jsonAction = json;
        this.helper = helper;
    }

    public build(): Action {
        return new BidAction(this.helper.getActionRequester(this.jsonAction),
            this.helper.getGameById(<string>this.jsonAction.actionData.gameId || ''),
            this.jsonAction.actionData.diceQuantity!,
            this.jsonAction.actionData.diceValue!,
            this.helper)
    }
}