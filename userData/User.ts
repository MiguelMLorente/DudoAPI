import { randomUUID } from "crypto";
import { Socket } from "socket.io";

export class User {
    private clientId: String;
    private userName: String;
    private joinedGame: String;
    private socketId: String;
    public numberOfDice: number;
    public diceValues: Array<number>;
    public isActive: boolean;
    public isAdmin: boolean;

    constructor(name: String, socket: Socket) {
        this.clientId = randomUUID();
        this.isAdmin = false
        this.userName = name;
        this.joinedGame = "";
        this.socketId = socket.id;
        this.numberOfDice = 5;
        this.diceValues = [];
        this.isActive = false;
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
        for (let i = 0; i < this.numberOfDice; i++) {
            this.diceValues.push(Math.floor(Math.random() * 6) + 1);
        }
    }
}