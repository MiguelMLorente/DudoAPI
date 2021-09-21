import { Action } from "../actionables/Action";
import { ServerData } from "../ServerData";
import { ActionBuilder } from "../utils/Builders/ActionBuilder/ActionBuilder";
import { Response } from "../utils/Builders/ResponseBuilder/Responses/Response";

export function handleRequest(message: any, serverData: ServerData, io: any) {
    try {
        let action: Action = new ActionBuilder(message, serverData).build();
        action.validate();
        if (action.Valid) {
            action.launch();
        }
        let response: Response = action.response();
        response.data.forEach((data) => {
            io.to(data.socketId).emit(response.channel, data.sentData);
        })

    } catch (e) {
        console.log(e);
        console.log("Error handling the client request. Malformed json response");
    }
}