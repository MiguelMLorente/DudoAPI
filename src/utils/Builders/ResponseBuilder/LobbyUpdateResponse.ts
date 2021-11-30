import { Game } from "../../../gameData/Game";
import { ResponseChannel } from "../../Enums/ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";
import { LobbyInfo } from "./Responses/ResponseLobbyInfo";

class LobbyUpdateResponse {
    playerList: Array<LobbyInfo>;
    hasAdminPermissions: boolean;
    constructor(playerList: Array<LobbyInfo>, isAdmin: boolean) {
        this.playerList = playerList;
        this.hasAdminPermissions = isAdmin;
    }
}

function buildLobbyUpdateResponse(game: Game): Array<ResponseDataModel> {
    let outputResponseDataModelArray: Array<ResponseDataModel> = [];

    let playerList: Array<LobbyInfo> = [];
    game.users.forEach((player) => {
        playerList.push(new LobbyInfo(player.UserName, player.isReady));
    });

    game.users.forEach((player) => {
        // Build response sent to this specific player
        let response: LobbyUpdateResponse = new LobbyUpdateResponse(playerList, player.isAdmin);
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