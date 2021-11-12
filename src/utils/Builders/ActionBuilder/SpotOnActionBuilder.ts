import { Action } from "../../../actionables/Action";
import { SpotOnAction } from "../../../actionables/ClientGameActions/SpotOnAction";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { UserAction } from "./UserAction";

export class SpotOnActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;

    constructor(json: UserAction, helper: ServerDataHelper) {
        this.jsonAction = json;
        this.helper = helper;
    }

    public build(): Action {
        return new SpotOnAction(this.helper.getActionRequester(this.jsonAction),
            this.helper.getGameById(<string>this.jsonAction.actionData.gameId || ''),
            this.helper);
    }
}