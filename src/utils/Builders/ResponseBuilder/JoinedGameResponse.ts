import { User } from "../../../userData/User";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

export default function getJoinedGameResponse(requester: User, gameId: String): Response {
    return new Response('joined-game', [new ResponseDataModel(requester.connectionId, gameId)]);
}