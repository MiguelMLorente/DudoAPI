import { Game } from "../../gameData/Game";
import { User } from "../../userData/User";
import getErrorResponse from "../../utils/Builders/ResponseBuilder/ErrorResponse";
import getGameStatusUpdateResponse from "../../utils/Builders/ResponseBuilder/GameStatusResponse";
import { Response } from "../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../utils/Enums/ErrorMessage";
import { GameStatus } from "../../utils/Enums/GameStatus";
import { RoundType } from "../../utils/Enums/RoundType";
import { ServerDataHelper } from "../../utils/Helpers/ServerDataHelper";
import { Action } from "../Action";

export class SelectOptionAction extends Action {
    helper: ServerDataHelper;
    game: Game;
    option: string;

    constructor(requester: User, game: Game, option: string, helper: ServerDataHelper) {
        super(requester);
        this.game = game;
        this.option =  option;
        this.helper = helper;
    };

    public validate(): void {
        if (this.game == null) {
            // Game must exist
            this.errorMessage = ErrorMessage.GAME_NOT_FOUND;
        } else if (!this.helper.checkUserRegisteredInGame(this.requester, this.game)) {
            // The user must be registered in this game to act
            this.errorMessage = ErrorMessage.USER_NOT_REGISTERED
        } else if (this.game.status !== GameStatus.CURRENT) {
            // Game must not have started yet
            this.errorMessage = ErrorMessage.GAME_NOT_STARTED;
        } else if (this.game.activeRound) {
            // Round must not be active
            this.errorMessage = ErrorMessage.ROUND_ACTIVE
        } else if (this.requester !== this.game.getCurrentPlayer()) {
            // Game must exist and have matching password
            this.errorMessage = ErrorMessage.NOT_TURN;
        } else if (this.option !== RoundType.BLIND && this.option !== RoundType.OPEN) {
            // Round type must be one of the options
            this.errorMessage = ErrorMessage.UNRECOGNISED_TYPE;
        } else {
            this.isValid = true;
        }

        let message: String = (this.isValid ? "validated" : "invalid") + " set select option action";
        console.log(message);
    }

    public launch(): void {
        // Set the user to have an special round active
        this.requester.specialRoundActive = true;
        // Set the special round type
        this.game.roundType = this.option;
        // Start the round
        this.game.startRound(false);
    }

    public response(): Response {
        if (!this.isValid) {
            return getErrorResponse(this.requester, this.errorMessage);
        } else {
            return getGameStatusUpdateResponse(this.game);
        }
    }
}