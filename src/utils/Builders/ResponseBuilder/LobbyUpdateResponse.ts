import { Game } from "../../../gameData/Game";
import { ResponseChannel } from "../../Enums/ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";
import { LobbyInfo } from "./Responses/ResponseLobbyInfo";

class LobbyUpdateResponse {
    playerList: Array<LobbyInfo>;

    constructor(playerList: Array<LobbyInfo>) {
        this.playerList = playerList;
    }
}

function buildLobbyUpdateResponse(game: Game): Array<ResponseDataModel> {
    let outputResponseDataModelArray: Array<ResponseDataModel> = [];

    let playerList: Array<LobbyInfo> = [];
    game.users.forEach((player) => {
        playerList.push(new LobbyInfo(player.UserName, player.isReady));
    })
    let response: LobbyUpdateResponse = new LobbyUpdateResponse(playerList);

    game.users.forEach((player) => {
        // Build response sent to this specific player
        let responseModel: ResponseDataModel = new ResponseDataModel(
            player.connectionId,
            response
        );

        outputResponseDataModelArray.push(responseModel)
    })
    return outputResponseDataModelArray;
}

export default function getLobbyUpdateResponse(game: Game): Response {
    return new Response(ResponseChannel.LOBBY_UPDATE, buildLobbyUpdateResponse(game));
}