export abstract class User {
    protected clientId: String = "";
    protected userName: String = "";

    constructor() {};

    get Id(): String {
        return this.clientId;
    }
}