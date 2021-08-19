import { User } from "../userData/User";

export abstract class Action {
    protected id?: String;
    protected isValid?: boolean;
    protected requester?: User;

    constructor() {};
    abstract validate(): void;
    abstract launch(): void;
}