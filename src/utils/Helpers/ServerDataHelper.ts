import { Game } from "../../gameData/Game";
import { ServerData } from "../../ServerData";
import { User } from "../../userData/User";
import { UserAction } from "../Builders/ActionBuilder/UserAction";
import { ErrorMessage } from "../Enums/ErrorMessage";

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
            return this.serverData.games[id];
        } catch(e) {
            console.log(e);
        }
        return null as any;
    }

    public getGameByName(name: String): Game {
        for (let key in this.serverData.games) {
            if (this.serverData.games[key].name == name) {
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

    public addGame(game: Game): void {
        this.serverData.games[game.gameId.valueOf()] = game;
    }

    public checkUserNotRegisteredInAnyGame(user: User): boolean {
        return (user.joinedGame === "");
    }

    public checkUserRegisteredInGame(user: User, game: Game): boolean {
        return game.users.some(player => player === user)
    }
}