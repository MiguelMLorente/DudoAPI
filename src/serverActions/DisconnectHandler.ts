import { ServerData } from "../ServerData";
import { Response } from "../utils/Builders/ResponseBuilder/Responses/Response";
import { ServerDataHelper } from "../utils/Helpers/ServerDataHelper";
import { User } from "../userData/User";
import { Game } from "../gameData/Game";
import { GameStatus } from "../utils/Enums/GameStatus";
import getGameStatusUpdateResponse from "../utils/Builders/ResponseBuilder/GameStatusResponse";
import getLobbyUpdateResponse from "../utils/Builders/ResponseBuilder/LobbyUpdateResponse";
import { getEndOfGameResponse } from "../utils/Builders/ResponseBuilder/EndOfGameResponse";

export function handleDisconnect(socketId: string, serverData: ServerData, io: any) {

    try {
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
                    if (!disconnectedUser.isAdmin) {
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
        // Send response if applicable
        if (response !== undefined) {
            if (response instanceof Response) {
                var channel = response.channel;
                response.data.forEach((data) => {
                    io.to(data.socketId).emit(channel, data.sentData);
                });
            } else {
                response.forEach((partialResponse) => {
                    partialResponse.data.forEach((data: { socketId: String; sentData: any; }) => {
                        io.to(data.socketId).emit(partialResponse.channel, data.sentData);
                    })
                });
            }
        }  
    } catch(error) {
        console.log(error);
    }
}