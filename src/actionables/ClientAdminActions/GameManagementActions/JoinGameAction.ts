import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import getJoinedGameResponse from "../../../utils/Builders/ResponseBuilder/JoinedGameResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../../utils/Enums/ErrorMessage";
import { GameStatus } from "../../../utils/Enums/GameStatus";
import { ServerDataHelper } from "../../../utils/Helpers/ServerDataHelper";
import { Action } from "../../Action";

export class JoinGameAction extends Action {
    gameShortId: String;
    gamePassword: String;
    userName: String;
    helper: ServerDataHelper;
    joinedGame: Game;

    constructor(requester: User, gameShortId: String, gamePassword: String, userName: String, helper: ServerDataHelper) {
        super(requester);
        this.gameShortId = gameShortId;
        this.gamePassword = gamePassword;
        this.userName = userName;
        this.helper = helper;
        this.joinedGame = this.helper.getGameByShortId(this.gameShortId);
    };

    public validate(): void {
        if (this.gameShortId === "") {
            // Game name must not be empty
            this.errorMessage = ErrorMessage.GAME_SHORT_ID;
        } else if (this.userName === "") {
            // User name must not be empty
            this.errorMessage = ErrorMessage.USER_NAME;
        } else if (!this.helper.checkUserNotRegisteredInAnyGame(this.requester)) {
            // User must not be registered in any game in order to create a new game
            this.errorMessage = ErrorMessage.USER_REGISTERED;
        } else if ((this.joinedGame === null) || (this.gamePassword !== this.joinedGame.password)) {
            // Game must exist and have matching password
            this.errorMessage = ErrorMessage.PASSWORD;
        } else if (this.joinedGame.numberOfPlayers >= Game.maxPlayers) {
            // Game must have space for a new player
            this.errorMessage = ErrorMessage.GAME_FULL;
        } else if (this.joinedGame.status !== GameStatus.NOT_STARTED) {
            // Check that the game has not started yet
            this.errorMessage = ErrorMessage.GAME_STARTED;
        } else if (this.helper.checkDuplicatePlayerName(this.requester, this.joinedGame)) {
            // Check that the user name does not exist in the current game;
            this.errorMessage = ErrorMessage.DUPLICATED_NAME;
        } else {
            this.isValid = true;
        }
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
}