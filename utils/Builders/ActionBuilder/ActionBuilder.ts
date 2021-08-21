import { Action } from "../../../actionables/Action";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { ActionType } from "../../ActionType";
import { getUser } from "../../Getters/UserGetter";
import { BidActionBuilder } from "./BidActionBuilder";
import { CreateGameActionBuilder } from "./CreateGameActionBuilder";
import { RaiseActionBuilder } from "./RaiseActionBuilder";
import { UserAction } from "./UserAction";

export class ActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;
    requester: User;

    constructor(json: UserAction, serverData: ServerData) {
        console.log(json)
        console.log(json.requester.uuid)
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = this.getRequester()
    }

    private getRequester(): User {
        let user: User = getUser(this.serverData, this.jsonAction.requester.uuid)
        if (user == null) {
            throw new Error("User not found in database");
        }
        console.log(user);
        return user;
    }

    public build(): Action {
        switch (this.jsonAction.actionType) {
            case ActionType.BID:
                return new BidActionBuilder(this.jsonAction, this.serverData, this.requester).build();
            case ActionType.RAISE:
                return new RaiseActionBuilder(this.jsonAction, this.serverData, this.requester).build();
            case ActionType.CREATE_GAME:
                return new CreateGameActionBuilder(this.jsonAction, this.serverData, this.requester).build();
            default:
                return new BidActionBuilder(this.jsonAction, this.serverData, this.requester).build();  
        }
    }
}
