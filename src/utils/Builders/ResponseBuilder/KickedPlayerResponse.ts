import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import { ResponseChannel } from "../../Enums/ResponseChannels";
import getGameStatusUpdateResponse from "./GameStatusResponse";
import getLobbyUpdateResponse from "./LobbyUpdateResponse";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

function buildKickedPlayerResponse(user: User): Array<ResponseDataModel> {
    let outputResponseDataModelArray: Array<ResponseDataModel> = [];
    let response: ResponseDataModel = new ResponseDataModel(user.connectionId, "");
    outputResponseDataModelArray.push(response);
    return outputResponseDataModelArray;
}

function getKickedPlayerResponse(user: User): Response {
    return new Response(ResponseChannel.KICKED_PLAYER, buildKickedPlayerResponse(user));
}

export function getKickedPlayerAndLobbyUpdateResponse(kickedUser: User, game: Game): Array<Response> {
    let outputResponse: Array<Response> = [];
    outputResponse.push(getKickedPlayerResponse(kickedUser));
    outputResponse.push(getLobbyUpdateResponse(game));
    return outputResponse;
}

export function getKickedPlayerAndGameStatusUpdateResponse(kickedUser: User, game: Game): Array<Response> {
    let outputResponse: Array<Response> = [];
    outputResponse.push(getKickedPlayerResponse(kickedUser));
    outputResponse.push(getGameStatusUpdateResponse(game));
    return outputResponse;
}
