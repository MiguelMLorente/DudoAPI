import { User } from "../../../userData/User";
import { ResponseChannel } from "../../Enums/ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

export default function getMessageResponse(requester: User): Response {
    return new Response(ResponseChannel.MESSAGE, [new ResponseDataModel(requester.connectionId, 'this is a message response')]);
}