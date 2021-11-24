import { Game } from "../../gameData/Game";
import { User } from "../../userData/User";
import getClientRequestResponse from "../../utils/Builders/ResponseBuilder/ClientRequestResponse";
import getErrorResponse from "../../utils/Builders/ResponseBuilder/ErrorResponse";
import { Response } from "../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../utils/Enums/ErrorMessage";
import { GameStatus } from "../../utils/Enums/GameStatus";
import { Action } from "../Action";

export class RequestClientOptionAction extends Action {
    requestedClient?: User
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
            this.errorMessage = ErrorMessage.REQUEST_CLIENT_ERROR;
        } else if (this.game.activeRound) {
            this.errorMessage = ErrorMessage.ROUND_ACTIVE;
        } else {
            this.isValid = true;
        }
    }

    public launch(): void {
        // Get the player that should provide the selected option
        this.requestedClient = this.game.getPlayerToRequest();
    }

    public response(): Response {
        if (!this.isValid) {
            return getErrorResponse(this.requester, this.errorMessage);
        } else {
            return getClientRequestResponse(this.game, this.requestedClient!);
        }
    }
}