import { Game } from "../../../src/gameData/Game";
import { ServerData } from "../../../src/ServerData";
import { User } from "../../../src/userData/User";
import { getEndOfGameResponse } from "../../../src/utils/Builders/ResponseBuilder/EndOfGameResponse";
import getGameStatusUpdateResponse from "../../../src/utils/Builders/ResponseBuilder/GameStatusResponse";
import getLobbyUpdateResponse from "../../../src/utils/Builders/ResponseBuilder/LobbyUpdateResponse";
import { GameStatus } from "../../../src/utils/Enums/GameStatus";
import { ServerDataHelper } from "../../../src/utils/Helpers/ServerDataHelper";
import { Response } from "../../../src/utils/Builders/ResponseBuilder/Responses/Response";

export function handleDisconnect(socketId: string, serverData: ServerData): Response | Array<Response> {
    let helper: ServerDataHelper = new ServerDataHelper(serverData);
    let disconnectedUser: User = helper.getUserBySocketId(socketId);
    let game: Game = helper.getGameById(<string>disconnectedUser.joinedGame);
    let response: Response | Array<Response> = undefined as any;

    // Remove user from dataBase
    helper.eraseUser(disconnectedUser);
    disconnectedUser.isConnected = false;
    if (game !== null) {
        // If user has joined some game:
        if (game.status === GameStatus.NOT_STARTED) {
            // If the joined game didn't start yet
            game.removePlayer(disconnectedUser);
            if (game.numberOfPlayers === 0) {
                // If the game is empty, delete it from serverData
                helper.eraseGame(game);
            } else if (game.numberOfPlayers > 1 && game.areAllPlayersReady()) {
                // If all players are ready, start the game and send game-status response
                game.startGame();
                response = getGameStatusUpdateResponse(game);
            } else {
                // If some player is still not ready, send lobby update
                response = getLobbyUpdateResponse(game);
                if (disconnectedUser.isAdmin) {
                    // TODO send user promotion to new player
                    // response2 = getLobbyUpdateResponse(game);
                }
            }
        } else if (game.status === GameStatus.CURRENT && disconnectedUser.isAlive) {
            // If the joined game has started and the player is still alive
            disconnectedUser.isAlive = false;
            game.alivePlayers--;
            if (game.alivePlayers === 1) {
                // If only one player remains, send him as winner
                game.endGame();
                response = getEndOfGameResponse(game);
            } else {
                // If there are players in game, start a new round
                if (disconnectedUser.isActive) {
                    // If it was this player's turn, set the next player
                    game.setNextPlayer();
                }
                game.startRound(false);
                response = getGameStatusUpdateResponse(game);
            }
        } else if (game.status === GameStatus.FINISHED && !game.isAnyPlayerConnected()) {
            helper.eraseGame(game);
        }
    }
    return response;
}