import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import getJoinedGameResponse from "../../../utils/Builders/ResponseBuilder/JoinedGameResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../../utils/Enums/ErrorMessage";
import { ServerDataHelper } from "../../../utils/Helpers/ServerDataHelper";
import { Action } from "../../Action";

export class CreateGameAction extends Action {
    helper: ServerDataHelper;
    gamePassword: String;
    userName: String;
    game?: Game;

    constructor(requester: User, gamePassword: String, userName: String, helper: ServerDataHelper) {
        super(requester);
        this.gamePassword = gamePassword;
        this.userName = userName;
        this.helper = helper;
    };

    public validate(): void {
        if (this.userName === "") {
            // User name must not be empty
            this.errorMessage = ErrorMessage.USER_NAME;
        } else if (!this.helper.checkUserNotRegisteredInAnyGame(this.requester)) {
            // User must not be registered in any game in order to create a new game
            this.errorMessage = ErrorMessage.USER_REGISTERED;
        } else {
            this.isValid = true;
        }

        // Print message
        let message: String = (this.isValid ? "validated" : "invalid") + " create game action";
        console.log(message);
    }

    public launch(): void {
        // Set user name
        this.requester.setUserName(this.userName);
        // Create new game with the given name and password
        let shortId: String = this.helper.shortId()
        let game: Game = new Game(shortId, this.gamePassword);
        // Add the game creator as the first player of the game and Admin permissions
        game.addUser(this.requester);
        this.requester.grantAdminPermisions();
        // Add game Id to the user data set
        this.requester.joinGame(game.gameId);
        // Add the game to the game list in the server data base
        this.helper.addGame(game);
        this.game = game;
        // Set the user as not ready yet
        this.requester.isReady = false;
    }

    public response(): Response {
        if ((this.isValid) && (this.game != null)) {
            return getJoinedGameResponse(this.game);
        } else {
            return getErrorResponse(this.requester, this.errorMessage);
        }
    }
}