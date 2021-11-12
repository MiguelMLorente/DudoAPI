import { Game } from "../../gameData/Game";
import { User } from "../../userData/User";
import getErrorResponse from "../../utils/Builders/ResponseBuilder/ErrorResponse";
import getGameStatusUpdateResponse from "../../utils/Builders/ResponseBuilder/GameStatusResponse";
import getLobbyUpdateResponse from "../../utils/Builders/ResponseBuilder/LobbyUpdateResponse";
import { Response } from "../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../utils/Enums/ErrorMessage";
import { GameStatus } from "../../utils/Enums/GameStatus";
import { ServerDataHelper } from "../../utils/Helpers/ServerDataHelper";
import { Action } from "../Action";

export class SetIsPlayerReadyAction extends Action {
    helper: ServerDataHelper;
    game: Game;
    ready: boolean;
    gameStarted: boolean;

    constructor(requester: User, game: Game, ready: boolean, helper: ServerDataHelper) {
        super(requester);
        this.game = game;
        this.ready =  ready;
        this.gameStarted = false;
        this.helper = helper;
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
        } else if ((!this.requester.isReady) !== this.ready) {
            // Game must exist and have matching password
            this.errorMessage = ErrorMessage.READY;
        } else {
            this.isValid = true;
        }

        let message: String = (this.isValid ? "validated" : "invalid") + " set isPlayerReady action";
        console.log(message);
    }

    public launch(): void {
        // Ready or unready player according to request
        this.requester.isReady = this.ready;
        // Start the game if all the players are ready
        if (this.game.areAllPlayersReady()) {
            this.game.startGame();
            this.gameStarted = true;
        }
    }

    public response(): Response {
        if (!this.isValid) {
            return getErrorResponse(this.requester, this.errorMessage);
        } else if (this.gameStarted) {
            return getGameStatusUpdateResponse(this.game);
        } else {
            return getLobbyUpdateResponse(this.game);
        }
    }
}