export abstract class User {
    protected clientId: String = "";
    protected userName: String = "";
    isAdmin: boolean;

    constructor() {
        this.isAdmin = false
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