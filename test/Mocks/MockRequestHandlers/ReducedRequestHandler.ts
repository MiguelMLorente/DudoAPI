import { Action } from "../../../src/actionables/Action";
import { ServerData } from "../../../src/ServerData";
import { ActionBuilder } from "../../../src/utils/Builders/ActionBuilder/ActionBuilder";
import { Response } from "../../../src/utils/Builders/ResponseBuilder/Responses/Response";

export function handleRequest(message: any, serverData: ServerData): Response | Array<Response> {
    let action: Action = new ActionBuilder(message, serverData).build();
    action.validate();
    if (action.Valid) {
        action.launch();
    }
    let response: Response | Array<Response> = action.response();
    return response;
}