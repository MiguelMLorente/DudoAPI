import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import getGameStatusUpdateResponse from "../../../utils/Builders/ResponseBuilder/GameStatusResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../../utils/ErrorMessage";
import { GameStatus } from "../../../utils/GameStatus";
import { Action } from "../../Action";

export class StartGameAction extends Action {
    game: Game;

    constructor(requester: User, game: Game, serverData: ServerData) {
        super(requester, serverData);
        this.game = game;
    };

    public validate(): void {
        if (this.game == null) {
            // Game must exist
            this.errorMessage = ErrorMessage.GAME_NOT_FOUND;
        } else if (!this.checkUserRegisteredInThisGame()) {
            // User must be registered in this game in order to start it
            this.errorMessage = ErrorMessage.USER_NOT_REGISTERED;
        } else if (this.game.status !== GameStatus.NOT_STARTED) {
            // Game must not have started yet
            this.errorMessage = ErrorMessage.GAME_STARTED;
        } else if (!this.requester.isAdmin) {
            // Game must exist and have matching password
            this.errorMessage = ErrorMessage.NOT_ADMIN;
        } else {
            this.isValid = true;
        }

        // Print message
        let message: String = (this.isValid ? "validated" : "invalid") + " start game action";
        console.log(message);
    }

    public launch(): void {
        // Create new game with the given name and password
        this.game.startGame();
    }

    public response(): Response {
        if (this.isValid) {
            return getGameStatusUpdateResponse(this.game);
        } else {
            return getErrorResponse(this.requester, this.errorMessage);
        }
    }

    private checkUserRegisteredInThisGame(): boolean {
        // Checks if the user is registered in any game in the server
        let foundUser = false
        this.game!.users.forEach((user) => {
            if (foundUser) return;
            if (user.Id === this.requester.Id) foundUser = true;
        })
        return foundUser;
    }
}