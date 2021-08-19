import { randomUUID } from "crypto";
import { User } from "./User";

export class NormalUser extends User {
    constructor(name?: String) {
        super();
        this.userName = name || '';
        this.clientId = randomUUID();
    }
}