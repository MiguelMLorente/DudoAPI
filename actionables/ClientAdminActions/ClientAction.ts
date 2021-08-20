import { ServerData } from "../../ServerData";
import { Action } from "../Action";

export abstract class ClientAction extends Action {

    serverData: ServerData;

    constructor(serverData: ServerData) {
        super();
        this.serverData = serverData;
    };

    validate(): void {
        this.isValid = true;
    }
}