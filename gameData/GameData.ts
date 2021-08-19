import { randomUUID } from "crypto";
import { User } from "../userData/User";
import { GameStatus } from "../utils/GameStatus";

export class GameData {
    private id: String;
    private playerList: Array<User>;
    private gameStatus: String;
    private gameHistory: Array<String>;

    constructor() {
        this.id = randomUUID();
        this.playerList = [];
        this.gameStatus = GameStatus.NOT_STARTED;
        this.gameHistory = []
    }

    get Id(): String {
        return this.id;
    }
}