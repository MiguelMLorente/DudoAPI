import { Bid } from "../../gameData/Bid";
import { Game } from "../../gameData/Game";
import { ServerData } from "../../ServerData";
import { User } from "../../userData/User";
import getErrorResponse from "../../utils/Builders/ResponseBuilder/ErrorResponse";
import getGameStatusUpdateResponse from "../../utils/Builders/ResponseBuilder/GameStatusResponse";
import getMessageResponse from "../../utils/Builders/ResponseBuilder/MessageResponse";
import { Response } from "../../utils/Builders/ResponseBuilder/Responses/Response";
import { GameStatus } from "../../utils/GameStatus";
import { GameAction } from "./GameAction";

export class BidAction extends GameAction {
    diceValue: number;
    diceQuantity: number;
    currentBid?: Bid;

    constructor(requester: User, serverData: ServerData, game: Game, diceQuantity: number, diceValue: number) {
        super(requester, serverData, game);
        this.diceQuantity = diceQuantity;
        this.diceValue = diceValue;
        this.currentBid = this.game.currentBid;
    };

    public validate(): void {
        console.log("bid action being validated");
        super.validate();
        // check if game has started
        this.isValid = (this.isValid && (this.game!.status === GameStatus.CURRENT));
        // check if player is active
        this.isValid = (this.isValid && (this.requester.isActive));
        // check if diceValue is correct
        this.isValid = (this.isValid && ((this.diceValue > 0) && (this.diceValue <= 6)));
        this.isValid = (this.isValid && (this.diceValue % 1 === 0));
        // check if diceQuantity is correct
        this.isValid = (this.isValid && (this.diceQuantity > 0));
        this.isValid = (this.isValid && (this.diceQuantity % 1 === 0));
        // check if the quantity and values are admisible in the current game state
        if (this.currentBid !== undefined) {
            // value of the dice must increase or remain constant
            this.isValid = (this.isValid && (this.diceValue >= this.currentBid.value))
            // if value states constant, number of dice must increase
            if (this.diceValue === this.currentBid.value) {
                this.isValid = (this.isValid && (this.diceQuantity > this.currentBid.number))
            }
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
            return getErrorResponse(this.requester);
        }
    }
}