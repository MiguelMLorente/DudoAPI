import { Game } from "../../../gameData/Game";
import { ResponseChannel } from "../../Enums/ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";
import { LobbyInfo } from "./Responses/ResponseLobbyInfo";

class JoinedGameResponse {
    gameId: string;
    gameShortId: string;
    playerList: Array<LobbyInfo>;

    constructor(gameId: string, gameShortId: string, playerList: Array<LobbyInfo>) {
        this.gameId = gameId;
        this.gameShortId = gameShortId;
        this.playerList = playerList;
    }
}

function buildJoinedGameResponse(game: Game): Array<ResponseDataModel> {
    let outputResponseDataModelArray: Array<ResponseDataModel> = [];

    let playerList: Array<LobbyInfo> = [];
    game.users.forEach((player) => {
        playerList.push(new LobbyInfo(player.UserName, player.isReady));
    })
    let response: JoinedGameResponse = new JoinedGameResponse(<string>game.gameId, <string>game.shortId, playerList);

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

export default function getJoinedGameResponse(game: Game): Response {
    return new Response(ResponseChannel.JOIN_GAME, buildJoinedGameResponse(game));
}