import { randomUUID } from "crypto";

export class User {
    protected clientId: String;
    protected userName: String;
    
    isAdmin: boolean;

    constructor(name: String) {
        this.clientId = randomUUID();
        this.isAdmin = false
        this.userName = name;
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
}