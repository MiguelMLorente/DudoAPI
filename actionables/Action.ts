import { User } from "../userData/User";
import { randomUUID } from "crypto";
import { ServerData } from "../ServerData";
import { Response } from "../utils/Responses/ResponseModel";

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

    abstract validate(): void;

    abstract launch(): void;

    abstract response(): Response;

    get Valid(): boolean {
        return this.isValid;
    }

    get requesterConnectionId(): String {return this.requester.connectionId}
}