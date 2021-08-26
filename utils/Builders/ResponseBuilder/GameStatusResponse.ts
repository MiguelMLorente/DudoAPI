import { Game } from "../../../gameData/Game";
import { User } from "../../../userData/User";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

class CurrentBid {
    diceValue: number;
    diceNumber: number;
    doneBy: String;

    constructor(diceValue: number, diceNumber: number, doneBy: String) {
        this.diceNumber = diceNumber;
        this.diceValue = diceValue;
        this.doneBy = doneBy;
    }
}

class PlayerInfo {
    playerName: String;
    isActive: boolean;
    diceNumber?: number;
    diceValue?: Array<number>;

    constructor(name: String, active: boolean, diceNumber?: number, diceValue?: Array<number>) {
        this.playerName = name;
        this.isActive = active;
        this.diceNumber = diceNumber;
        this.diceValue = diceValue;
    }
}

class StatusUpdateResponse {
    currentBid?: CurrentBid;
    numberOfPlayers: number;
    playersInfo: Array<PlayerInfo>;

    constructor(num: number, bid?: CurrentBid) {
        this.playersInfo = [];
        this.numberOfPlayers = num;
        this.currentBid = bid;
    }
}

function getUnknownDicePlayerInfo(players: Array<User>): Array<PlayerInfo> {
    return players.map( (player) => {
            return new PlayerInfo(player.UserName, player.isActive)
        }
    );
}

function getKnownDicePlayerInfo(players: Array<User>): Array<PlayerInfo> {
    return players.map( (player) => {
            return new PlayerInfo(player.UserName, 
                player.isActive,
                player.numberOfDice,
                player.diceValues)
        }
    );
}

function buildGameStatusResponse(game: Game): Array<ResponseDataModel> {
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

    game.users.forEach( (player) => {
        // Build response sent to this specific player
        let response: ResponseDataModel = new ResponseDataModel(
            player.connectionId,
            new StatusUpdateResponse(game.numberOfPlayers, bid)
        );
        
        // Include players info in response (each player must know only their dice info)
        for (let i = 0; i < game.numberOfPlayers; i++) {
            if (player === game.users[i]) {
                response.sentData.playersInfo.push(knownDicePlayerInfo[i]);
            } else {
                response.sentData.playersInfo.push(unknownDicePlayerInfo[i]);
            }
        }
        outputResponseDataModelArray.push(response)
    })
    return outputResponseDataModelArray;
}

export default function getGameStatusUpdateResponse(game: Game): Response {
    return new Response('game-status', buildGameStatusResponse(game));
}
