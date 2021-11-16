import { Game } from "../../../gameData/Game";
import { ResponseChannel } from "../../Enums/ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

function buildEndOfGameResponse(game: Game): Array<ResponseDataModel> {
    let outputResponseDataModelArray: Array<ResponseDataModel> = [];

    let message: any = {"winner": game.winner!.UserName};
    game.users.forEach((player) => {
        outputResponseDataModelArray.push(new ResponseDataModel(player.connectionId, message));
    })

    return outputResponseDataModelArray;
}

export function getEndOfGameResponse(game: Game): Response {
    return new Response(ResponseChannel.END_GAME, buildEndOfGameResponse(game));
}