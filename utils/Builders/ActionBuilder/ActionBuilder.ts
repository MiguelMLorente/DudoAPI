import { Action } from "../../../actionables/Action";
import { ActionType } from "../../ActionType";
import { BidActionBuilder } from "./BidActionBuilder";
import { RaiseActionBuilder } from "./RaiseActionBuilder";
import { UserAction } from "./UserAction";

export class ActionBuilder {
    jsonAction: UserAction;

    constructor(json: UserAction) {
        this.jsonAction = json;
    }

    public build(): Action {
        switch (this.jsonAction.actionType) {
            case ActionType.BID:
                return new BidActionBuilder(this.jsonAction).build();
            case ActionType.RAISE:
                return new RaiseActionBuilder(this.jsonAction).build();
            default:
                return new BidActionBuilder(this.jsonAction).build();  
        }
    }
}
