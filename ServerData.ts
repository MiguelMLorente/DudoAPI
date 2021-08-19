import { Game } from "./gameData/Game";
import { User } from "./userData/User";

export class ServerData {
    games: Array<Game>;
    users: Array<User>;

    constructor() {
        this.games = [];
        this.users = [];
    }

    public getGameById(id: String): Game {
        try {
            for (var i = 0; i < this.games.length; i++){
                if (this.games[i].gameId === id) return this.games[i];
            }
            throw new Error("There is no game with the seeked id");
        } catch(e) {
            console.log(e);
        }
        return null as any;
    }

    public getUserId(id: String): User {
        try {
            for (var i = 0; i < this.users.length; i++){
                if (this.users[i].Id === id) return this.users[i];
            }
            throw new Error("There is no user with the seeked id");
        } catch(e) {
            console.log(e);
        }
        return null as any;
    }
}