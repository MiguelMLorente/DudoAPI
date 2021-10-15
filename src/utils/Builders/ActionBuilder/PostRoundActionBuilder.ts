import { Action } from "../../../actionables/Action";
import { EndGameAction } from "../../../actionables/ClientAdminActions/GameManagementActions/EndGameAction";
import { NewRoundAction } from "../../../actionables/ClientAdminActions/GameManagementActions/NewRoundAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { UserAction } from "./UserAction";

export class PostRoundActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;
    game: Game;

    constructor(json: UserAction, serverData: ServerData) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.game = this.serverData.getGameById(<string>this.jsonAction.actionData.gameId || '');
    }

    public build(): Action {
        if (this.game.alivePlayers === 1) {
            return new EndGameAction(this.game, this.serverData);
        } else {
            return new NewRoundAction(this.game, this.serverData);
        }
    }
}