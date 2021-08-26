import { Game } from "../../gameData/Game";
import { ServerData } from "../../ServerData";
import { User } from "../../userData/User";
import getMessageResponse from "../../utils/Builders/ResponseBuilder/MessageResponse";
import { Response } from "../../utils/Builders/ResponseBuilder/Responses/Response";
import { GameAction } from "./GameAction";

export class BidAction extends GameAction {
    diceValue: number;
    diceQuantity: number;

    constructor(requester: User, serverData: ServerData, game: Game, diceQuantity: number, diceValue: number) {
        super(requester, serverData, game);
        this.diceQuantity = diceQuantity;
        this.diceValue = diceValue;
    };

    public validate(): void {
        console.log("action being validated");
        super.validate();
        // check if diceValue is correct
        this.isValid = (this.isValid && ((this.diceValue > 0) && (this.diceValue <= 6)));
        this.isValid = (this.isValid && (this.diceValue % 1 === 0));
        // check if diceQuantity is correct
        this.isValid = (this.isValid && (this.diceQuantity > 0));
        this.isValid = (this.isValid && (this.diceQuantity % 1 === 0));
        // check if the quantity and values are admisible in the current game state
        // TO-DO
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("action being launched");
    }

    public response(): Response {
        return getMessageResponse(this.requester);
    }
}