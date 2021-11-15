import { Action } from "../actionables/Action";
import { ServerData } from "../ServerData";
import { ActionBuilder } from "../utils/Builders/ActionBuilder/ActionBuilder";
import { postRoundAction } from "../utils/PostRoundAction";
import { Response } from "../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../utils/Enums/ErrorMessage";
import { ResponseChannel } from "../utils/Enums/ResponseChannels";

export function handleRequest(message: any, serverData: ServerData, io: any) {
    try {
        let action: Action = new ActionBuilder(message, serverData).build();
        action.validate();
        if (action.Valid) {
            action.launch();
        }

        let response: Response | Array<Response> = action.response();
        if (response instanceof Response) {
            var channel = response.channel;
            if (channel === ResponseChannel.INTERNAL_ERROR) {
                throw new Error("Internal server error");
            } else {
                response.data.forEach((data) => {
                    io.to(data.socketId).emit(channel, data.sentData);
                })
            }

            if (channel === ResponseChannel.END_ROUND) {
                setTimeout(() => {
                    handleRequest(postRoundAction(message), serverData, io);
                }, 1000);
            } 
        } else {
            response.forEach((partialResponse) => {
                partialResponse.data.forEach((data: { socketId: String; sentData: any; }) => {
                    io.to(data.socketId).emit(partialResponse.channel, data.sentData);
                })
            });
        }   

    } catch (e) {
        console.log(e);
        console.log(ErrorMessage.GENERAL_ERROR);
    }
}