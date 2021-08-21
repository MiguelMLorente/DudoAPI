export abstract class User {
    protected clientId: String = "";
    private userName: String = "";

    constructor() {};

    get Id(): String {
        return this.clientId;
    }

    public setUserName(name: String) {
        if (this.userName) throw new Error("User name already exists, cannot be rewritten")
        this.userName = name;
    }
}