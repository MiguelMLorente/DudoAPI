import { randomUUID } from "crypto";
import { NormalUser } from "./NormalUser";
import { User } from "./User";

export class AdminUser extends NormalUser {
    constructor(name?: String) {
        super(name);
    }
}