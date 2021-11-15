import { Action } from "../../../actionables/Action";
import { KickUserAction } from "../../../actionables/ClientAdminActions/UsersManagementActions/KickUserAction";
import { Game } from "../../../gameData/Game";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { UserAction } from "./UserAction";

export class KickUserActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;
    game: Game;

    constructor(json: UserAction, helper: ServerDataHelper) {
        this.jsonAction = json;
        this.helper = helper;
        this.game = this.helper.getGameById(<string>this.jsonAction.actionData.gameId!)
    }

    public build(): Action {
        return new KickUserAction(this.helper.getActionRequester(this.jsonAction),
            this.helper.getUserByName(this.jsonAction.actionData.kickedUser!, this.game),
            this.helper,
            this.game);
    }
}