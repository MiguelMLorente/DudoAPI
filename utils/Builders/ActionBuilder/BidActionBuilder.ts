import { Action } from "../../../actionables/Action";
import { BidAction } from "../../../actionables/ClientGameActions/BidAction";
import { Game } from "../../../gameData/Game";
import { NormalUser } from "../../../userData/NormalUser";
import { User } from "../../../userData/User";
import { UserAction } from "./UserAction";

export class BidActionBuilder{
    jsonAction: UserAction;

    constructor(json: UserAction) {
        this.jsonAction = json;
    }

    public build(): Action {
        return new BidAction(this.getRequester(),
            this.getGame(),
            this.jsonAction.actionData.diceQuantity,
            this.jsonAction.actionData.diceValue)
    }

    public getRequester(): User {
        return new NormalUser("Pau");
    }

    public getGame(): Game {
        return new Game()
    }
}