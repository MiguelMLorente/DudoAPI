import { Action } from "../../../actionables/Action";
import { CallAction } from "../../../actionables/ClientGameActions/CallAction";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { UserAction } from "./UserAction";

export class CallActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;

    constructor(json: UserAction, helper: ServerDataHelper) {
        this.jsonAction = json;
        this.helper = helper;
    }

    public build(): Action {
        return new CallAction(this.helper.getActionRequester(this.jsonAction),
            this.helper.getGameById(<string>this.jsonAction.actionData.gameId || ''),
            this.helper);
    }
}