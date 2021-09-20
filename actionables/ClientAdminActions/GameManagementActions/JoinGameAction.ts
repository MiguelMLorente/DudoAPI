import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import getGameStatusUpdateResponse from "../../../utils/Builders/ResponseBuilder/GameStatusResponse";
import getJoinedGameResponse from "../../../utils/Builders/ResponseBuilder/JoinedGameResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
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
        console.log("join game action being validated");

        if (this.gameName === "") {
            // Game name must not be empty
            this.errorMessage = "Game name not inserted";
        } else if (this.userName === "") {
            // User name must not be empty
            this.errorMessage = "User name not inserted";
        } else if (!this.checkUserNotRegisteredInGame()) {
            // User must not be registered in any game in order to create a new game
            this.errorMessage = "User already registered in a different game";
        } else if ((this.joinedGame === null) || (this.gamePassword !== this.joinedGame.password)) {
            // Game must exist and have matching password
            this.errorMessage = "Incorrect game name or password, try again";
        } else if (this.joinedGame.status !== GameStatus.NOT_STARTED) {
            // Check that the game has not started yet
            this.errorMessage = "The game has already started";
        } else {
            this.isValid = true;
        }

        // Print message
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("join game action being launched");
        // Set user name
        this.requester.setUserName(this.userName);
        // Add the game creator as the first player of the game and Admin permissions
        this.joinedGame.addUser(this.requester);
        // Add game Id to the user data set
        this.requester.joinGame(this.joinedGame.gameId);
    }

    public response(): Response {
        if (this.isValid) {
            return getJoinedGameResponse(this.requester, this.joinedGame.gameId);
        } else {
            return getErrorResponse(this.requester, this.errorMessage);
        }
    }

    private checkUserNotRegisteredInGame(): boolean {
        // Checks if the user is registered in any game in the server
        return (this.requester.joinedGame === "");
    }
}