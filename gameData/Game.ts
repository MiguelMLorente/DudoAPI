import { User } from "../userData/User";
import { GameData } from "./GameData";

export class Game {
    public gameData: GameData;

    constructor(gameName?: String, password?: String) {
        this.gameData = new GameData(gameName || '', password || '');
    }

    get gameId(): String {
        return this.gameData.Id;
    }

    get users(): Array<User> {
        return this.gameData.Users;
    }
}