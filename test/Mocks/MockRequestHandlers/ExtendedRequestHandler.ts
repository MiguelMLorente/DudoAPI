import { Action } from "../../../src/actionables/Action";
import { ServerData } from "../../../src/ServerData";
import { ActionBuilder } from "../../../src/utils/Builders/ActionBuilder/ActionBuilder";
import { Response } from "../../../src/utils/Builders/ResponseBuilder/Responses/Response";
import { ResponseChannel } from "../../../src/utils/Enums/ResponseChannels";
import { postRoundAction } from "../../../src/utils/PostRoundAction";

export function handleExtendedRequest(message: any, serverData: ServerData): Response | Array<Response> {
    let action: Action = new ActionBuilder(message, serverData).build();
    action.validate();
    if (action.Valid) {
        action.launch();
    }
    let response: Response | Array<Response> = action.response();
    if ((response instanceof Response) && (response.channel === ResponseChannel.END_ROUND)) {
        response = handleExtendedRequest(postRoundAction(message), serverData);
    }
    return response;
}