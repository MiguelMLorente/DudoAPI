import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import { ResponseChannel } from "../../Enums/ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

class ClientRequestResponse {
    players: Array<string>; 
    requested: Array<boolean>;

    constructor() {
        this.players = [];
        this.requested = [];
    }
}

function buildClientRequestResponse(game: Game, requestedUser: User): Array<ResponseDataModel> {
    let outputResponseDataModelArray: Array<ResponseDataModel> = [];
    let clientRequestResponse: ClientRequestResponse = new ClientRequestResponse();
    game.users.forEach((user) => {
        clientRequestResponse.players.push(<string>user.UserName);
        clientRequestResponse.requested.push(user === requestedUser);
    });

    game.users.forEach((player) => {
        // Build response sent to this specific player
        let response: ResponseDataModel = new ResponseDataModel(
            player.connectionId,
            new ClientRequestResponse()
        );
        outputResponseDataModelArray.push(response)
    })
    return outputResponseDataModelArray;
}

export default function getClientRequestResponse(game: Game, requestedUser: User): Response {
    return new Response(ResponseChannel.CLIENT_REQUEST_OPTION, buildClientRequestResponse(game, requestedUser));
}
