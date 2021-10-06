import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import getGameStatusUpdateResponse from "../../../utils/Builders/ResponseBuilder/GameStatusResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { GameStatus } from "../../../utils/GameStatus";
import { Action } from "../../Action";

export class StartGameAction extends Action {
    game: Game;

    constructor(requester: User, game: Game, serverData: ServerData) {
        super(requester, serverData);
        this.game = game;
    };

    public validate(): void {
        console.log("start game action being validated");

        if (this.game === null) {
            // Game must exist
            this.errorMessage = "Game not found";
        } else if (!this.checkUserRegisteredInThisGame()) {
            // User must be registered in this game in order to start it
            this.errorMessage = "The user is not registered in this game";
        } else if (this.game.status !== GameStatus.NOT_STARTED) {
            // Game must not have started yet
            this.errorMessage = "Game has already been started";
        } else if (!this.requester.isAdmin) {
            // Game must exist and have matching password
            this.errorMessage = "User does not have admin permissions for this game";
        } else {
            this.isValid = true;
        }

        // Print message
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("start game action being launched");
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
        if (this.game === undefined) return false;
        this.game.users.forEach((user) => {
            if (foundUser) return;
            if (user.Id === this.requester.Id) foundUser = true;
        })
        return foundUser;
    }
}