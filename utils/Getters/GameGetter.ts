import { Game } from '../../gameData/Game';
import { ServerData } from '../../ServerData'

export function getGameByName(serverData: ServerData, name: String): Game {
    for (let i = 0; i < serverData.games.length; i++) {
        if (serverData.games[i].name == name) {
            return serverData.games[i];
        }
    }
    return null as any;
}