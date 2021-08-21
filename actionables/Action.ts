import { User } from "../userData/User";
import { randomUUID } from "crypto";
import { ServerData } from "../ServerData";

export abstract class Action {
    protected id: String;
    protected isValid: boolean;
    protected requester: User;
    protected serverData: ServerData;

    constructor(requester: User, serverData: ServerData) {
        this.requester = requester;
        this.serverData = serverData;
        this.isValid = true;
        this.id = randomUUID();
    };

    validate(): void {
        // Check that the requester is registered in the data base
        console.log(this.requester);
        if (!this.requester.Id || !this.requester.userName) {
            this.isValid = false;
            return;
        }
        let validUser = false;
        this.serverData.users.forEach( (user) => {
            if (validUser) return;
            if (user.Id === this.requester.Id) {
                validUser = true;
            }
        });
        this.isValid = validUser;
    };

    abstract launch(): void;

    get Valid(): boolean {
        return this.isValid;
    }
}