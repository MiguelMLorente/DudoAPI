import { Game } from "../../gameData/Game";
import { ServerData } from "../../ServerData";
import { User } from "../../userData/User";
import { Action } from "../Action";

export abstract class GameAction extends Action {
    game: Game;

    constructor(requester: User, serverData: ServerData, game: Game) {
        super(requester, serverData);
        this.game = game
    };

    validate(): void {
        this.isValid = true;
    }
}