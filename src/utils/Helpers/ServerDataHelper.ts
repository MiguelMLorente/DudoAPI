import { Game } from "../../gameData/Game";
import { ServerData } from "../../ServerData";
import { User } from "../../userData/User";
import { UserAction } from "../Builders/ActionBuilder/UserAction";
import { ErrorMessage } from "../Enums/ErrorMessage";
import { customAlphabet } from "nanoid";

export class ServerDataHelper {
    serverData: ServerData;

    constructor(serverData: ServerData) {
        this.serverData = serverData;
    }

    public getActionRequester(json: UserAction): User {
        if (json.requester.uuid === "internal") {
            return <User><unknown>undefined;
        }
        let user: User = this.getUserById(json.requester.uuid.valueOf())
        if (user == null) {
            throw new Error(ErrorMessage.USER_NOT_FOUND);
        }
        return user;
    }

    public getGameById(id: string): Game {
        try {
            let game: Game = this.serverData.games[id];
            if (game !== undefined) return game;
        } catch(e) {
            console.log(e);
        }
        return null as any;
    }

    public getGameByShortId(shortId: String): Game {
        for (let key in this.serverData.games) {
            if (this.serverData.games[key].shortId == shortId) {
                return this.serverData.games[key];
            }
        }
        return null as any;
    }

    public getUserById(id: string): User {
        try {
            return this.serverData.users[id];
        } catch(e) {
            console.log(e);
        }
        return null as any;
    }

    public getUserBySocketId(id: string): User {
        for (let key in this.serverData.users) {
            if (this.serverData.users[key].connectionId == id) {
                return this.serverData.users[key];
            }
        }
        throw new Error("Internal server error, socket ID not found");
    }

    public getUserByName(name: String, game: Game): User {
        try {
            if (!game) return null as any;
            for (var i = 0; i < game.numberOfPlayers; i++) {
                if (game.users[i].UserName == name) {
                    return game.users[i];
                }
            }
        } catch(e) {
            console.log(e);
        }
        return null as any;
    }

    public shortId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ",6);

    public addGame(game: Game): void {
        this.serverData.games[game.gameId.valueOf()] = game;
    }

    public checkUserNotRegisteredInAnyGame(user: User): boolean {
        return (user.joinedGame === "");
    }

    public checkUserRegisteredInGame(user: User, game: Game): boolean {
        return game.users.some(player => player === user)
    }

    public checkDuplicatePlayerName(newPlayerName: string, game: Game): boolean {
        var output: boolean = false;
        game.users.forEach((player) => {
            if (player.UserName === newPlayerName) {
                output = true;
            }
        });
        return output;
    }

    public eraseUser(user: User): void {
        delete this.serverData.users[<string>user.Id];
    } 

    public eraseGame(game: Game): void {
        delete this.serverData.games[<string>game.gameId];
    }
}