import { GameData } from "./GameData";

export class Game {
    gameData: GameData;

    constructor(gameName?: String, password?: String) {
        this.gameData = new GameData(gameName || '', password || '');
    }

    get gameId(): String {
        return this.gameData.Id;
    }
}