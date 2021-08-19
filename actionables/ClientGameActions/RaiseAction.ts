import { Game } from "../../gameData/Game";
import { User } from "../../userData/User";
import { GameAction } from "./GameAction";

export class RaiseAction extends GameAction {
    constructor(requester: User, game: Game) {
        super(game);
        this.requester = requester;
    };

    public validate(): void {
        console.log("action being validated");
        this.isValid = true;
        // check if the quantity and values are admisible in the current game state
        // TO-DO
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("action being launched");
    }
}