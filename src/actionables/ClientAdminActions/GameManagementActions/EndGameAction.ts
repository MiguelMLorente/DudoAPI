import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import { getEndOfGameResponse } from "../../../utils/Builders/ResponseBuilder/EndOfGameResponse";
import getInternalErrorResponse from "../../../utils/Builders/ResponseBuilder/InternalErrorResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../../utils/Enums/ErrorMessage";
import { GameStatus } from "../../../utils/Enums/GameStatus";
import { Action } from "../../Action";

export class EndGameAction extends Action {
    game: Game;

    constructor(game: Game) {
        super(null as unknown as User);
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
        let message: String = (this.isValid ? "validated" : "invalid") + " end game action";
        console.log(message);
    }

    public launch(): void {
        this.game.endGame();
    }

    public response(): Response {
        if (this.isValid) {
            return getEndOfGameResponse(this.game, this.game.winner!);
        } else {
            console.log(this.errorMessage)
            return getInternalErrorResponse();
        }
    }
}