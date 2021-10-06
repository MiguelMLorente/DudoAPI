import { Game } from "./gameData/Game";
import { User } from "./userData/User";

export class ServerData {
    public games: Record<string, Game>;
    public users: Record<string, User>;

    constructor() {
        this.games = {};
        this.users = {};
    }

    public getGameById(id: string): Game {
        try {
            return this.games[id];
        } catch(e) {
            console.log(e);
        }
        return null as any;
    }

    public getUserById(id: string): User {
        try {
            return this.users[id];
        } catch(e) {
            console.log(e);
        }
        return null as any;
    }

    public getUserId(id: string): User {
        try {
            return this.users[id];
        } catch(e) {
            console.log(e);
        }
        return null as any;
    }
}