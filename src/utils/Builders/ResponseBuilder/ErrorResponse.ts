import { User } from "../../../userData/User";
import { ResponseChannel } from "../../ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

export default function getErrorResponse(requester: User, errorMessage: String): Response {
    return new Response(ResponseChannel.ERROR, [new ResponseDataModel(requester.connectionId, errorMessage)]);
}