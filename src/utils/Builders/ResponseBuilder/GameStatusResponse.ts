import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import { ErrorMessage } from "../../Enums/ErrorMessage";
import { ResponseChannel } from "../../Enums/ResponseChannels";
import { RoundType } from "../../Enums/RoundType";
import { Response } from "./Responses/Response";
import { CurrentBid } from "./Responses/ResponseCurrentBid";
import { ResponseDataModel } from "./Responses/ResponseDataModel";
import { PlayerInfo } from "./Responses/ResponsePlayerInfo"

class StatusUpdateResponse {
    currentBid?: CurrentBid;
    playersInfo: Array<PlayerInfo>;

    constructor(bid?: CurrentBid) {
        this.playersInfo = [];
        this.currentBid = bid;
    }
}

function getUnknownDicePlayerInfo(players: Array<User>): Array<PlayerInfo> {
    return players.map((player) => {
        return new PlayerInfo(player.UserName, player.isActive, player.isAlive)
    }
    );
}

function getKnownDicePlayerInfo(players: Array<User>): Array<PlayerInfo> {
    return players.map((player) => {
        return new PlayerInfo(player.UserName,
            player.isActive,
            player.isAlive,
            player.numberOfDice,
            player.diceValues)
    }
    );
}

function buildGameStatusResponse(game: Game, shouldBeKnownDice: Function): Array<ResponseDataModel> {
    let outputResponseDataModelArray: Array<ResponseDataModel> = [];

    // Write bid info in case there is a bid stated
    let bid: CurrentBid | undefined;
    if (game.currentBid) {
        bid = new CurrentBid(game.currentBid.value,
            game.currentBid.number,
            game.currentBid.doneBy.UserName)
    }

    // Get the player information with and without dice information
    let unknownDicePlayerInfo: Array<PlayerInfo> = getUnknownDicePlayerInfo(game.users);
    let knownDicePlayerInfo: Array<PlayerInfo> = getKnownDicePlayerInfo(game.users);

    game.users.forEach((player) => {
        // Build response sent to this specific player
        let response: ResponseDataModel = new ResponseDataModel(
            player.connectionId,
            new StatusUpdateResponse(bid)
        );

        // Include players info in response (each player must know only their dice info)
        let i = 0;
        shouldBeKnownDice(player).forEach((shouldBeKnown: boolean) => {
            if (shouldBeKnown) {
                response.sentData.playersInfo.push(knownDicePlayerInfo[i]);
            } else {
                response.sentData.playersInfo.push(unknownDicePlayerInfo[i]);
            }
            i++;
        });
        outputResponseDataModelArray.push(response)
    })
    return outputResponseDataModelArray;
}

function buildNormalGameStatusResponse(game: Game): Array<ResponseDataModel> {
    let shouldBeKnownDice: Function = ((player: User) =>  game.users.map(user => user === player));
    return buildGameStatusResponse(game, shouldBeKnownDice);
}

function buildBlindGameStatusResponse(game: Game): Array<ResponseDataModel> {
    let shouldBeKnownDice: Function = ((player: User) =>  game.users.map(user => (user === player && user.specialRoundActive)));
    return buildGameStatusResponse(game, shouldBeKnownDice);
}

function buildOpenGameStatusResponse(game: Game): Array<ResponseDataModel> {
    let shouldBeKnownDice: Function = ((player: User) =>  game.users.map(user => user !== player));
    return buildGameStatusResponse(game, shouldBeKnownDice);
}

export default function getGameStatusUpdateResponse(game: Game): Response {
    switch (game.roundType) {
        case RoundType.NORMAL:
            return new Response(ResponseChannel.GAME_STATUS, buildNormalGameStatusResponse(game));
        case RoundType.BLIND:
            return new Response(ResponseChannel.GAME_STATUS, buildBlindGameStatusResponse(game));
        case RoundType.OPEN:
            return new Response(ResponseChannel.GAME_STATUS, buildOpenGameStatusResponse(game));
        default:
            throw new Error(ErrorMessage.GENERAL_ERROR);
    }
}
