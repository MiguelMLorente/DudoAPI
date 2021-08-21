import { Action } from "../../../actionables/Action";
import { RaiseAction } from "../../../actionables/ClientGameActions/RaiseAction";
import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { UserAction } from "./UserAction";

export class RaiseActionBuilder{
    jsonAction: UserAction;
    serverData: ServerData;
    requester: User;

    constructor(json: UserAction, serverData: ServerData, requester: User) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = requester;
    }

    public build(): Action {
        return new RaiseAction(this.requester,
            this.serverData,
            this.getGame());
    }
    public getGame(): Game {
        return new Game()
    }
} 