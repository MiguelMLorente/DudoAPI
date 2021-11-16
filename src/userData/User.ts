import { v4 as uuid } from "uuid";

export class User {
    private clientId: String;
    private userName: String;
    public joinedGame: String;
    private socketId: String;
    public numberOfDice: number;
    public diceValues: Array<number>;
    public isActive: boolean;
    public isAdmin: boolean;
    public isAlive: boolean;
    public isReady: boolean;
    public isConnected: boolean;

    constructor(name: String, socketId: String) {
        this.clientId = uuid();
        this.isAdmin = false
        this.userName = name;
        this.joinedGame = "";
        this.socketId = socketId;
        this.numberOfDice = 5;
        this.diceValues = [];
        this.isActive = false;
        this.isAlive = true;
        this.isReady = false;
        this.isConnected = true;
    };

    get Id(): String {
        return this.clientId;
    }

    get connectionId(): String {
        return this.socketId
    }

    public setUserName(name: String) {
        if (this.userName === name) return;
        if (this.userName) throw new Error("User name already exists, cannot be rewritten")
        this.userName = name;
    }

    get UserName(): String {
        return this.userName;
    }

    public grantAdminPermisions(): void {
        this.isAdmin = true;
    }

    public joinGame(id: String): void {
        this.joinedGame = id;
    }

    public rollDice(): void {
        this.diceValues = [];
        if (this.isAlive) {
            for (let i = 0; i < this.numberOfDice; i++) {
                this.diceValues.push(Math.floor(Math.random() * 6) + 1);
            }
        }
    }
}