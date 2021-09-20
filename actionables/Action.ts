import { User } from "../userData/User";
import { v4 as uuid } from "uuid";
import { ServerData } from "../ServerData";
import { Response } from "../utils/Builders/ResponseBuilder/Responses/Response";

export abstract class Action {
    protected errorMessage: String;
    protected id: String;
    protected isValid: boolean;
    protected requester: User;
    protected serverData: ServerData;

    constructor(requester: User, serverData: ServerData) {
        this.requester = requester;
        this.serverData = serverData;
        this.isValid = false;
        this.errorMessage = '';
        this.id = uuid();
    };

    abstract validate(): void;

    abstract launch(): void;

    abstract response(): Response;

    get Valid(): boolean {
        return this.isValid;
    }

    get requesterConnectionId(): String { return this.requester.connectionId }
}