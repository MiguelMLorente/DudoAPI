import { randomUUID } from "crypto";
import { User } from "../userData/User";
import { GameStatus } from "../utils/GameStatus";

export class GameData {
    private id: String;
    private playerList: Array<User>;
    private gameStatus: String;
    private gameHistory: Array<String>;
    private gameName: String;
    private gamePassword: String;

    constructor(name?: String, password?: String) {
        this.id = randomUUID();
        this.playerList = [];
        this.gameStatus = GameStatus.NOT_STARTED;
        this.gameHistory = []
        this.gameName = name || '';
        this.gamePassword = password || '';
    }

    get Id(): String {
        return this.id;
    }

    get Users(): Array<User> {
        return this.playerList;
    }
    
    public addUser(user: User): void {
        this.playerList.push(user);
    }
}