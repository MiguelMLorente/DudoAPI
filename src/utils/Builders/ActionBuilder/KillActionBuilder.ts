import { Action } from "../../../actionables/Action";
import { KillAction } from "../../../actionables/ClientGameActions/KillAction";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { UserAction } from "./UserAction";

export class KillActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;

    constructor(json: UserAction, helper: ServerDataHelper) {
        this.jsonAction = json;
        this.helper = helper;
    }

    public build(): Action {
        return new KillAction(this.helper.getActionRequester(this.jsonAction),
            this.helper.getGameById(<string>this.jsonAction.actionData.gameId || ''),
            this.helper);
    }
}