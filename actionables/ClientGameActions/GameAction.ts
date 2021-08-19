import { Game } from "../../gameData/Game";
import { Action } from "../Action";

export abstract class GameAction extends Action {
    game: Game;

    constructor(game: Game) {
        super();
        this.game = game
    };

    validate(): void {
        this.isValid = true;
    }
}