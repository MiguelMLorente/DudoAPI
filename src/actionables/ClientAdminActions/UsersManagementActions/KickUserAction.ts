import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import { getKickedPlayerAndGameStatusUpdateResponse, getKickedPlayerAndLobbyUpdateResponse } from "../../../utils/Builders/ResponseBuilder/KickedPlayerResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../../utils/Enums/ErrorMessage";
import { GameStatus } from "../../../utils/Enums/GameStatus";
import { ServerDataHelper } from "../../../utils/Helpers/ServerDataHelper";
import { Action } from "../../Action";

export class KickUserAction extends Action {
    helper: ServerDataHelper;
    kickedPlayer: User;
    game: Game;
    gameStarted: boolean;

    constructor(requester: User, kickedPlayer: User, helper: ServerDataHelper, game: Game) {
        super(requester);
        this.kickedPlayer = kickedPlayer;
        this.helper = helper;
        this.game = game;
        this.gameStarted = false;
    };

    public validate(): void {
        if (this.game == null) {
            // Game must exist
            this.errorMessage = ErrorMessage.GAME_NOT_FOUND;
        } else if (!this.helper.checkUserRegisteredInGame(this.requester, this.game)) {
            // The user must be registered in this game to act
            this.errorMessage = ErrorMessage.USER_NOT_REGISTERED
        } else if (this.game.status !== GameStatus.NOT_STARTED) {
            // Game must not have started yet
            this.errorMessage = ErrorMessage.GAME_STARTED;
        } else if (!this.requester.isAdmin) {
            // User must be admin to kick another user;
            this.errorMessage = ErrorMessage.NOT_ADMIN;
        } else if (!this.helper.checkUsersRegisteredInTheSameGame(this.requester, this.kickedPlayer)) {
            // Kicker and kicked users must be registered in the same game
            this.errorMessage = ErrorMessage.USER_NOT_REGISTERED;
        } else {
            this.isValid = true;
        }

        // Print message
        let message: String = (this.isValid ? "validated" : "invalid") + " kick user action";
        console.log(message);
    }

    public launch(): void {
        this.kickedPlayer.setUserName("");
        this.kickedPlayer.joinedGame = "";
        this.kickedPlayer.isReady = false;
        this.game.removePlayer(this.kickedPlayer);
        if (this.game.numberOfPlayers > 1 && this.game.areAllPlayersReady()) {
            this.game.startGame();
            this.gameStarted = true;
        }
    }

    public response(): Response | Array<Response> {
        if (!this.isValid) {
            return getErrorResponse(this.requester, this.errorMessage);
        } else if (this.gameStarted) {
            return getKickedPlayerAndGameStatusUpdateResponse(this.kickedPlayer, this.game);
        } else {
            return getKickedPlayerAndLobbyUpdateResponse(this.kickedPlayer, this.game);
        }
    }
}