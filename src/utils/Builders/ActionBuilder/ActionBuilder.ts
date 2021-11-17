import { Action } from "../../../actionables/Action";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { ActionType } from "../../Enums/ActionType";
import { ErrorMessage } from "../../Enums/ErrorMessage";
import { ServerDataHelper } from "../../Helpers/ServerDataHelper";
import { BidActionBuilder } from "./BidActionBuilder";
import { CallActionBuilder } from "./CallActionBuilder";
import { CreateGameActionBuilder } from "./CreateGameActionBuilder";
import { JoinGameActionBuilder } from "./JoinGameActionBuilder";
import { KickUserActionBuilder } from "./KickUserActionBuilder";
import { KillActionBuilder } from "./KillActionBuilder";
import { PostRoundActionBuilder } from "./PostRoundActionBuilder";
import { SetIsPlayerReadyActionBuilder } from "./SetIsPlayerReadyActionBuilder";
import { SpotOnActionBuilder } from "./SpotOnActionBuilder";
import { UserAction } from "./UserAction";

export class ActionBuilder {
    jsonAction: UserAction;
    helper: ServerDataHelper;
    requester: User;

    constructor(json: UserAction, serverData: ServerData) {
        this.jsonAction = json;
        this.helper = new ServerDataHelper(serverData);
        this.requester = this.helper.getActionRequester(this.jsonAction)
    }

    public build(): Action {
        switch (this.jsonAction.actionType) {
            // Game management actions
            case ActionType.CREATE_GAME:
                return new CreateGameActionBuilder(this.jsonAction, this.helper).build();
            case ActionType.JOIN_GAME:
                return new JoinGameActionBuilder(this.jsonAction, this.helper).build();
            // User management actions
            case ActionType.KICK_USER:
                return new KickUserActionBuilder(this.jsonAction, this.helper).build();
            // Client game actions
            case ActionType.PLAYER_READY:
                return new SetIsPlayerReadyActionBuilder(this.jsonAction, this.helper).build();
            case ActionType.BID:
                return new BidActionBuilder(this.jsonAction, this.helper).build();
            case ActionType.CALL:
                return new CallActionBuilder(this.jsonAction, this.helper).build();
            case ActionType.SPOT_ON:
                return new SpotOnActionBuilder(this.jsonAction, this.helper).build();
            case ActionType.KILL:
                return new KillActionBuilder(this.jsonAction, this.helper).build();
            // Internal server actions
            case ActionType.POST_ROUND:
                return new PostRoundActionBuilder(this.jsonAction, this.helper).build();
            // Default error: unrecognised action
            default:
                throw new Error(ErrorMessage.UNKNOWN_ACTION);
        }
    }
}
