import { Action } from "../../../actionables/Action";
import { EndGameAction } from "../../../actionables/ClientAdminActions/GameManagementActions/EndGameAction";
import { NewRoundAction } from "../../../actionables/ClientAdminActions/GameManagementActions/NewRoundAction";
import { RequestClientOptionAction } from "../../../actionables/ClientGameActions/RequestClientOptionAction";
import { Game } from "../../../gameData/Game";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { UserAction } from "./UserAction";

export class PostRoundActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;
    game: Game;

    constructor(json: UserAction, helper: ServerDataHelper) {
        this.jsonAction = json;
        this.helper = helper;
        this.game = this.helper.getGameById(<string>this.jsonAction.actionData.gameId!)
    }

    public build(): Action {
        if (this.game.alivePlayers === 1) {
            return new EndGameAction(this.game);
        } else if (this.game.shouldBeSpecialRound()) {
            return new RequestClientOptionAction(this.game);
        } else {
            return new NewRoundAction(this.game);
        }
    }
}