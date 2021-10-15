import { Action } from "../actionables/Action";
import { ServerData } from "../ServerData";
import { ActionBuilder } from "../utils/Builders/ActionBuilder/ActionBuilder";
import { postRoundAction } from "../utils/PostRoundAction";
import { Response } from "../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../utils/ErrorMessage";
import { ResponseChannel } from "../utils/ResponseChannels";

export function handleRequest(message: any, serverData: ServerData, io: any) {
    try {
        let action: Action = new ActionBuilder(message, serverData).build();
        action.validate();
        if (action.Valid) {
            action.launch();
        }

        let response: Response = action.response();
        if (response.channel === ResponseChannel.INTERNAL_ERROR) {
            throw new Error("Internal server error");
        } else {
            response.data.forEach((data) => {
                io.to(data.socketId).emit(response.channel, data.sentData);
            })
        }
        
        if (response.channel === ResponseChannel.END_ROUND) {
            handleRequest(postRoundAction(message), serverData, io);
        }

    } catch (e) {
        console.log(e);
        console.log(ErrorMessage.GENERAL_ERROR);
    }
}