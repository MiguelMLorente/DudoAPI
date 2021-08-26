import { User } from "../../../userData/User";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

export default function getMessageResponse(requester: User): Response {
    return new Response('message', [new ResponseDataModel(requester.connectionId, 'this is a message response')]);
}