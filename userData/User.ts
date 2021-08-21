import { randomUUID } from "crypto";

export class User {
    private clientId: String;
    private userName: String;
    private joinedGame: String;
    
    isAdmin: boolean;

    constructor(name: String) {
        this.clientId = randomUUID();
        this.isAdmin = false
        this.userName = name;
        this.joinedGame = "";
    };

    get Id(): String {
        return this.clientId;
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
}