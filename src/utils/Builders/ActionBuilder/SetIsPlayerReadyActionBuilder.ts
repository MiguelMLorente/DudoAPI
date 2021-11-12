import { Action } from "../../../actionables/Action";
import { SetIsPlayerReadyAction } from "../../../actionables/ClientGameActions/SetIsPlayerReadyAction";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { UserAction } from "./UserAction";

export class SetIsPlayerReadyActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;

    constructor(json: UserAction, helper: ServerDataHelper) {
        this.jsonAction = json;
        this.helper = helper;
    }

    public build(): Action {
        return new SetIsPlayerReadyAction(this.helper.getActionRequester(this.jsonAction),
        this.helper.getGameById(<string>this.jsonAction.actionData.gameId || ''),
            this.jsonAction.actionData.ready!,
            this.helper
            )
    }
}