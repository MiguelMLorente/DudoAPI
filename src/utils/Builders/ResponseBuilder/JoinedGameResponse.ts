import { User } from "../../../userData/User";
import { ResponseChannel } from "../../ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

export default function getJoinedGameResponse(requester: User, gameId: String): Response {
    return new Response(ResponseChannel.JOIN_GAME, [new ResponseDataModel(requester.connectionId, gameId)]);
}