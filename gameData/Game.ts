import { GameData } from "./GameData";

export class Game {
    gameData: GameData;

    constructor() {
        this.gameData = new GameData();
    }

    get gameId(): String {
        return this.gameData.Id;
    }
}