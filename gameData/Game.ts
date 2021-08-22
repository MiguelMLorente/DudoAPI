import { User } from "../userData/User";
import { GameStatus } from "../utils/GameStatus";
import { GameData } from "./GameData";

export class Game {
    public gameData: GameData;

    constructor(gameName: String, password: String) {
        this.gameData = new GameData(gameName, password);
    }

    public startGame() {
        this.gameData.gameStatus = GameStatus.CURRENT;
    }



    get gameId(): String {
        return this.gameData.Id;
    }

    get users(): Array<User> {
        return this.gameData.Users;
    }

    get name(): String {
        return this.gameData.Name;
    }

    get gamePassword(): String {
        return this.gameData.Password;
    }
}