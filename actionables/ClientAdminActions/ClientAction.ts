import { ServerData } from "../../ServerData";
import { User } from "../../userData/User";
import { Action } from "../Action";

export abstract class ClientAction extends Action {

    constructor(requester: User, serverData: ServerData) {
        super(requester, serverData);
    };

    validate(): void {
        console.log(this.requester.UserName);
        this.isValid = this.isValid && (this.requester.UserName !== "");
    }
}