import { Action } from "../../../actionables/Action";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { ActionType } from "../../ActionType";
import { ErrorMessage } from "../../ErrorMessage";
import { BidActionBuilder } from "./BidActionBuilder";
import { CallActionBuilder } from "./CallActionBuilder";
import { CreateGameActionBuilder } from "./CreateGameActionBuilder";
import { JoinGameActionBuilder } from "./JoinGameActionBuilder";
import { PostRoundActionBuilder } from "./PostRoundActionBuilder";
import { SpotOnActionBuilder } from "./SpotOnActionBuilder";
import { StartGameActionBuilder } from "./StartGameActionBuilder";
import { UserAction } from "./UserAction";

export class ActionBuilder {
    jsonAction: UserAction;
    serverData: ServerData;
    requester: User;

    constructor(json: UserAction, serverData: ServerData) {
        this.jsonAction = json;
        this.serverData = serverData;
        this.requester = this.getRequester();
    }

    private getRequester(): User {
        if (this.jsonAction.requester.uuid === "internal") {
            return <User><unknown>undefined;
        }
        let user: User = this.serverData.getUserById(this.jsonAction.requester.uuid.valueOf())
        if (user == null) {
            throw new Error(ErrorMessage.USER_NOT_FOUND);
        }
        return user;
    }


    public build(): Action {
        switch (this.jsonAction.actionType) {
            case ActionType.BID:
                return new BidActionBuilder(this.jsonAction, this.serverData, this.requester).build();
            case ActionType.CALL:
                return new CallActionBuilder(this.jsonAction, this.serverData, this.requester).build();
            case ActionType.SPOT_ON:
                return new SpotOnActionBuilder(this.jsonAction, this.serverData, this.requester).build();
            case ActionType.CREATE_GAME:
                return new CreateGameActionBuilder(this.jsonAction, this.serverData, this.requester).build();
            case ActionType.JOIN_GAME:
                return new JoinGameActionBuilder(this.jsonAction, this.serverData, this.requester).build();
            case ActionType.START_GAME:
                return new StartGameActionBuilder(this.jsonAction, this.serverData, this.requester).build();
            case ActionType.POST_ROUND:
                return new PostRoundActionBuilder(this.jsonAction, this.serverData).build();
            default:
                return new BidActionBuilder(this.jsonAction, this.serverData, this.requester).build();
        }
    }
}
