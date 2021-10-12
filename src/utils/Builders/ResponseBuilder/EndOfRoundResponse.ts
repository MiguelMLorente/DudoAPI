import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import { ResponseChannel } from "../../ResponseChannels";
import { Response } from "./Responses/Response";
import { CurrentBid } from "./Responses/ResponseCurrentBid";
import { ResponseDataModel } from "./Responses/ResponseDataModel";
import { PlayerInfo } from "./Responses/ResponsePlayerInfo";

class EndOfRoundResponse {
    // Either call action, Spot on....
    action: String;
    requesterName: String;
    winnerName: String;
    loserName: String;
    currentBid: CurrentBid;
    playersInfo: Array<PlayerInfo>;

    constructor(requester: String, winner: String, loser: String, bid: CurrentBid, action: String, playersInfo: Array<PlayerInfo>) {
        this.playersInfo = playersInfo;
        this.requesterName = requester;
        this.winnerName = winner;
        this.loserName = loser;
        this.action = action;
        this.currentBid = bid;
    }
}

function getKnownDicePlayerInfo(players: Array<User>): Array<PlayerInfo> {
    return players.map((player) => {
        return new PlayerInfo(player.UserName,
            player.isActive,
            player.numberOfDice,
            player.diceValues)
    }
    );
}

function buildEndOfRoundResponse(game: Game, winner: User, loser: User, requester: User, action: String): Array<ResponseDataModel> {
    let outputResponseDataModelArray: Array<ResponseDataModel> = [];

    // Write bid info
    let bid: CurrentBid = new CurrentBid(game.currentBid!.value,
        game.currentBid!.number,
        game.currentBid!.doneBy.UserName);

    // Get the player information with dice information revealed
    let knownDicePlayerInfo: Array<PlayerInfo> = getKnownDicePlayerInfo(game.users);
    let responseData: EndOfRoundResponse = new EndOfRoundResponse(requester.UserName,
        winner.UserName,
        loser.UserName,
        bid,
        action,
        knownDicePlayerInfo);

    game.users.forEach((player) => {
        outputResponseDataModelArray.push(new ResponseDataModel(player.connectionId, responseData));
    })

    return outputResponseDataModelArray;
}

export default function getEndOfRoundResponse(game: Game, winner: User, loser: User, requester: User, action: String): Response {
    return new Response(ResponseChannel.END_ROUND, buildEndOfRoundResponse(game, winner, loser, requester, action));
}
