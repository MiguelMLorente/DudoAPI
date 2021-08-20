import { Action } from "../../../actionables/Action";
import { ServerData } from "../../../ServerData";
import { ActionType } from "../../ActionType";
import { BidActionBuilder } from "./BidActionBuilder";
import { CreateGameActionBuilder } from "./CreateGameActionBuilder";
import { RaiseActionBuilder } from "./RaiseActionBuilder";
import { UserAction } from "./UserAction";

export class ActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;

    constructor(json: UserAction, serverData: ServerData) {
        this.jsonAction = json;
        this.serverData = serverData;
    }

    public build(): Action {
        switch (this.jsonAction.actionType) {
            case ActionType.BID:
                return new BidActionBuilder(this.jsonAction).build();
            case ActionType.RAISE:
                return new RaiseActionBuilder(this.jsonAction).build();
            case ActionType.CREATE_GAME:
                return new CreateGameActionBuilder(this.jsonAction, this.serverData).build();
            default:
                return new BidActionBuilder(this.jsonAction).build();  
        }
    }
}
