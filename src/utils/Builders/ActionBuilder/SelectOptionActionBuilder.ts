import { Action } from "../../../actionables/Action";
import { SelectOptionAction } from "../../../actionables/ClientGameActions/SelectOptionAction";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { UserAction } from "./UserAction";

export class SelectOptionActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;

    constructor(json: UserAction, helper: ServerDataHelper) {
        this.jsonAction = json;
        this.helper = helper;
    }

    public build(): Action {
        return new SelectOptionAction(this.helper.getActionRequester(this.jsonAction),
            this.helper.getGameById(<string>this.jsonAction.actionData.gameId || ''),
            <string>this.jsonAction.actionData.selectedOption!,
            this.helper);
    }
}