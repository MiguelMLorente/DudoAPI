import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import getGameStatusUpdateResponse from "../../../utils/Builders/ResponseBuilder/GameStatusResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { GameStatus } from "../../../utils/GameStatus";
import { ClientAction } from "../ClientAction";

export class StartGameAction extends ClientAction {
    game: Game;

    constructor(requester: User, game: Game, serverData: ServerData) {
        super(requester, serverData);
        this.game = game;
    };

    public validate(): void {
        console.log("start game action being validated");
        super.validate();
        // Game must exist
        this.isValid = (this.isValid && (this.game !== null));
        // Check game has not started
        this.isValid = (this.isValid && (this.game.gameStatus === GameStatus.NOT_STARTED));
        // User must be registered in this game in order to start it
        this.isValid = (this.isValid && this.checkUserRegisteredInThisGame());
        // User must be admin to start the game
        this.isValid = (this.isValid && this.requester.isAdmin);
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
            return getErrorResponse(this.requester);
        }
    }

    private checkUserRegisteredInThisGame(): boolean {
        // Checks if the user is registered in any game in the server
        let foundUser = false
        if (this.game === undefined) return false;
        this.game.users.forEach( (user) => {
            if (foundUser) return;
            if (user.Id === this.requester.Id) foundUser = true;
        })
        return foundUser;
    }
}