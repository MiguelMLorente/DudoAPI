import { Action } from "../../../actionables/Action";
import { RaiseAction } from "../../../actionables/ClientGameActions/RaiseAction";
import { Game } from "../../../gameData/Game";
import { NormalUser } from "../../../userData/NormalUser";
import { User } from "../../../userData/User";
import { UserAction } from "./UserAction";

export class RaiseActionBuilder{
    jsonAction: UserAction;

    constructor(json: UserAction) {
        this.jsonAction = json;
    }

    public build(): Action {
        return new RaiseAction(this.getRequester(), this.getGame());
    }

    public getRequester(): User {
        return new NormalUser("Pau");
    }

    public getGame(): Game {
        return new Game()
    }
} 