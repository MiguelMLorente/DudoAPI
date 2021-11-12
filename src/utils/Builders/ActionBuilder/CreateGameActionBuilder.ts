import { Action } from "../../../actionables/Action";
import { CreateGameAction } from "../../../actionables/ClientAdminActions/GameManagementActions/CreateGameAction";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { UserAction } from "./UserAction";

export class CreateGameActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;

    constructor(json: UserAction, helper: ServerDataHelper) {
        this.jsonAction = json;
        this.helper = helper;
    }

    public build(): Action {
        return new CreateGameAction(this.helper.getActionRequester(this.jsonAction),
            this.jsonAction.actionData.gameName as String,
            this.jsonAction.actionData.gamePassword as String,
            this.jsonAction.requester.name as String,
            this.helper
            )
    }
}