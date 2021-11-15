import { v4 as uuid } from "uuid";
import { User } from "../userData/User";
import { Response } from "../utils/Builders/ResponseBuilder/Responses/Response";

export abstract class Action {
    protected errorMessage: String;
    protected id: String;
    protected isValid: boolean;
    protected requester: User;

    constructor(requester: User) {
        this.isValid = false;
        this.errorMessage = '';
        this.id = uuid();
        this.requester = requester;
    };

    abstract validate(): void;

    abstract launch(): void;

    abstract response(): Response | Array<Response>;

    get Valid(): boolean {
        return this.isValid;
    }
}