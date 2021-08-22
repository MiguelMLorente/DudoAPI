import { User } from "../userData/User";
import { GameStatus } from "../utils/GameStatus";
import { randomUUID } from "crypto";

export class Game {
    private id: String;
    private playerList: Array<User>;
    private gameStatus: String;
    private gameHistory: Array<String>;
    private gameName: String;
    private gamePassword: String;

    constructor(name: String, password: String) {
        this.id = randomUUID();
        this.playerList = [];
        this.gameStatus = GameStatus.NOT_STARTED;
        this.gameHistory = []
        this.gameName = name;
        this.gamePassword = password;
    }

    public startGame() {
        this.gameStatus = GameStatus.CURRENT;
    }

    public addUser(user: User): void {
        this.playerList.push(user);
    }

    get gameId(): String {
        return this.id;
    }

    get users(): Array<User> {
        return this.playerList;
    }

    get name(): String {
        return this.gameName;
    }

    get password(): String {
        return this.gamePassword;
    }
}