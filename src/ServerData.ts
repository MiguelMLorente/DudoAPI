import { Game } from "./gameData/Game";
import { User } from "./userData/User";

export class ServerData {
    public games: Record<string, Game>;
    public users: Record<string, User>;

    constructor() {
        this.games = {};
        this.users = {};
    }
}