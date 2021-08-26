import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import getGameStatusUpdateResponse from "../../../utils/Builders/ResponseBuilder/GameStatusResponse";
import getJoinedGameResponse from "../../../utils/Builders/ResponseBuilder/JoinedGameResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { GameStatus } from "../../../utils/GameStatus";
import { ClientAction } from "../ClientAction";

export class JoinGameAction extends ClientAction {
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
        super.validate();
        // User must not be registered in any game in order to create a new game
        this.isValid = (this.isValid && this.checkUserNotRegisteredInGame());
        // User name must not be empty
        this.isValid = (this.isValid && (this.userName != ""));
        // Check valid game
        this.isValid = (this.isValid && !(this.joinedGame == null));
        // Check game has not started
        this.isValid = (this.isValid && (this.joinedGame.gameStatus === GameStatus.NOT_STARTED));
        // Check correct password
        this.isValid = (this.isValid && (this.gamePassword === this.joinedGame.password));
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
            return getErrorResponse(this.requester);
        }
    }

    private checkUserNotRegisteredInGame(): boolean {
        // Checks if the user is registered in any game in the server
        return (this.requester.joinedGame === "");
    }
}