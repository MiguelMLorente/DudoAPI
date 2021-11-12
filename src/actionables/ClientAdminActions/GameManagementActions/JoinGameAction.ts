import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import getJoinedGameResponse from "../../../utils/Builders/ResponseBuilder/JoinedGameResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../../utils/ErrorMessage";
import { GameStatus } from "../../../utils/GameStatus";
import { Action } from "../../Action";

export class JoinGameAction extends Action {
    gameName: String;
    gamePassword: String;
    userName: String;
    joinedGame: Game;

    constructor(requester: User, gameName: String, gamePassword: String, userName: String, serverData: ServerData, joinedGame: Game) {
        super(requester, serverData);
        this.gameName = gameName;
        this.gamePassword = gamePassword;
        this.userName = userName;
        this.joinedGame = joinedGame;
    };

    public validate(): void {
        if (this.gameName === "") {
            // Game name must not be empty
            this.errorMessage = ErrorMessage.GAME_NAME;
        } else if (this.userName === "") {
            // User name must not be empty
            this.errorMessage = ErrorMessage.USER_NAME;
        } else if (!this.checkUserNotRegisteredInGame()) {
            // User must not be registered in any game in order to create a new game
            this.errorMessage = ErrorMessage.USER_REGISTERED;
        } else if ((this.joinedGame === null) || (this.gamePassword !== this.joinedGame.password)) {
            // Game must exist and have matching password
            this.errorMessage = ErrorMessage.PASSWORD;
        } else if (this.joinedGame.status !== GameStatus.NOT_STARTED) {
            // Check that the game has not started yet
            this.errorMessage = ErrorMessage.GAME_STARTED;
        } else {
            this.isValid = true;
        }

        // Print message
        let message: String = (this.isValid ? "validated" : "invalid") + " join game action";
        console.log(message);
    }

    public launch(): void {
        // Set user name
        this.requester.setUserName(this.userName);
        // Add the game creator as the first player of the game and Admin permissions
        this.joinedGame.addUser(this.requester);
        // Add game Id to the user data set
        this.requester.joinGame(this.joinedGame.gameId);
        // Set the user as not ready yet
        this.requester.isReady = false;
    }

    public response(): Response {
        if (this.isValid) {
            return getJoinedGameResponse(this.joinedGame);
        } else {
            return getErrorResponse(this.requester, this.errorMessage);
        }
    }

    private checkUserNotRegisteredInGame(): boolean {
        // Checks if the user is registered in any game in the server
        return (this.requester.joinedGame === "");
    }
}