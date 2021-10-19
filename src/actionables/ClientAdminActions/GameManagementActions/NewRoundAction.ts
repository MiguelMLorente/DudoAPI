import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import getGameStatusUpdateResponse from "../../../utils/Builders/ResponseBuilder/GameStatusResponse";
import getInternalErrorResponse from "../../../utils/Builders/ResponseBuilder/InternalErrorResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../../utils/ErrorMessage";
import { GameStatus } from "../../../utils/GameStatus";
import { Action } from "../../Action";

export class NewRoundAction extends Action {
    game: Game;

    constructor(game: Game, serverData: ServerData) {
        super(null as unknown as User, serverData);
        this.game = game;
    };

    public validate(): void {
        if (this.game == null) {
            // Game must exist
            this.errorMessage = ErrorMessage.GAME_NOT_FOUND;
        } else if (this.game.status !== GameStatus.CURRENT) {
            this.errorMessage = ErrorMessage.END_GAME_ERROR;
        } else if (this.game.activeRound) {
            this.errorMessage = ErrorMessage.ROUND_ACTIVE;
        } else {
            this.isValid = true;
        }

        // Print message
        let message: String = (this.isValid ? "validated" : "invalid") + " new round action";
        console.log(message);
    }

    public launch(): void {
        this.game.startRound(false);
    }

    public response(): Response {
        if (this.isValid) {
            return getGameStatusUpdateResponse(this.game);
        } else {
            console.log(this.errorMessage)
            return getInternalErrorResponse();
        }
    }
}