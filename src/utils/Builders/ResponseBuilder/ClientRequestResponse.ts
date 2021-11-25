import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import { ResponseChannel } from "../../Enums/ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

function buildClientRequestResponse(game: Game, requestedUser: User): Array<ResponseDataModel> {
    let outputResponseDataModelArray: Array<ResponseDataModel> = [];

    game.users.forEach((player) => {
        // Build response sent to this specific player
        let response: ResponseDataModel = new ResponseDataModel(
            player.connectionId,
            { playerRequested: requestedUser.UserName }
        );
        outputResponseDataModelArray.push(response)
    })
    return outputResponseDataModelArray;
}

export default function getClientRequestResponse(game: Game, requestedUser: User): Response {
    return new Response(ResponseChannel.CLIENT_REQUEST_OPTION, buildClientRequestResponse(game, requestedUser));
}
