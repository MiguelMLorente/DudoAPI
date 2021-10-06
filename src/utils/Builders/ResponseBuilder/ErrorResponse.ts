import { User } from "../../../userData/User";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

export default function getErrorResponse(requester: User, errorMessage: String): Response {
    return new Response('error', [new ResponseDataModel(requester.connectionId, errorMessage)]);
}