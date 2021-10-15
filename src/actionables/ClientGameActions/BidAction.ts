import { Bid } from "../../gameData/Bid";
import { Game } from "../../gameData/Game";
import { ServerData } from "../../ServerData";
import { User } from "../../userData/User";
import getErrorResponse from "../../utils/Builders/ResponseBuilder/ErrorResponse";
import getGameStatusUpdateResponse from "../../utils/Builders/ResponseBuilder/GameStatusResponse";
import { Response } from "../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../utils/ErrorMessage";
import { GameStatus } from "../../utils/GameStatus";
import { Action } from "../Action";

export class BidAction extends Action {
    diceValue: number;
    diceQuantity: number;
    currentBid?: Bid;
    game: Game;

    constructor(requester: User, serverData: ServerData, game: Game, diceQuantity: number, diceValue: number) {
        super(requester, serverData);
        this.game = game;
        this.diceQuantity = diceQuantity;
        this.diceValue = diceValue;
        this.currentBid = this.game.currentBid;
    };

    public validate(): void {
        console.log("bid action being validated");
        if (this.game == null) {
            // Game  must not be null
            this.errorMessage = ErrorMessage.GAME_NOT_FOUND;
        } else if (this.game.status !== GameStatus.CURRENT) {
            // Game must have started
            this.errorMessage = ErrorMessage.GAME_NOT_STARTED;
        } else if (this.game.activeRound === false) {
            // Round must be active
            this.errorMessage = ErrorMessage.ROUND_NOT_ACTIVE;
        } else if (!this.requester.isActive) {
            // Check if the users bidding turn is correct
            this.errorMessage = ErrorMessage.NOT_TURN;
        } else if (this.diceValue % 1 !== 0) {
            this.errorMessage = ErrorMessage.DICE_VAL_INT;
        } else if ((this.diceValue < 1) || (this.diceValue > 6)) {
            this.errorMessage = ErrorMessage.DICE_VAL_1_6;
        } else if (this.diceQuantity % 1 !== 0) {
            this.errorMessage = ErrorMessage.DICE_NUM_INT;
        } else if (this.diceQuantity < 1) {
            this.errorMessage = ErrorMessage.DICE_NUM_1;
        } else if (this.currentBid !== undefined) {
            // If there is an existing bid, we must check if the new one is compatible
            if (this.diceValue > this.currentBid.value) {
                // If the bid increases the dice value, then it's always valid
                this.isValid = true;
            } else if (this.diceValue < this.currentBid.value) {
                // If the bid decreases the dice value, the it's never valid
                this.errorMessage = ErrorMessage.BID;
            } else {
                // If the dice value stays constant, the the dice number must increase
                if (this.diceQuantity > this.currentBid.number) {
                    this.isValid = true;
                } else {
                    this.errorMessage = ErrorMessage.BID;
                }
            }
        } else {
            this.isValid = true;
        }
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("bid action being launched");
        if (this.game.currentBid === undefined) {
            this.game.currentBid = new Bid(this.diceValue, this.diceQuantity, this.requester);
        } else {
            this.game.currentBid.doneBy = this.requester;
            this.game.currentBid.number = this.diceQuantity;
            this.game.currentBid.value = this.diceValue;
        }
        this.game.setNextPlayer();
    }

    public response(): Response {
        if (this.isValid) {
            return getGameStatusUpdateResponse(this.game);
        } else {
            return getErrorResponse(this.requester, this.errorMessage);
        }
    }
}