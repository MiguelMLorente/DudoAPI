import { Game } from '../../gameData/Game';
import { ServerData } from '../../ServerData'

export function getGameByName(serverData: ServerData, name: String): Game {
    for (let key in serverData.games) {
        if (serverData.games[key].name == name) {
            return serverData.games[key];
        }
    }
    return null as any;
}