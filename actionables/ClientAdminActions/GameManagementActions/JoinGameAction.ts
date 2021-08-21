import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { getGameByName } from "../../../utils/Getters/GameGetter";
import { ClientAction } from "../ClientAction";

export class JoinGameAction extends ClientAction {
    gameName: String;
    gamePassword: String;
    joinedGame: Game;

    constructor(requester: User, gameName: String, gamePassword: String, serverData: ServerData, joinedGame: Game) {
        super(requester, serverData);
        this.gameName = gameName;
        this.gamePassword = gamePassword;
        this.joinedGame = joinedGame;
    };

    public validate(): void {
        console.log("join game action being validated");
        super.validate();
        // User must not be registered in any game in order to create a new game
        this.isValid = (this.isValid && !this.checkUserRegisteredInGame());
        // Check valid game
        this.isValid = (this.isValid && !(this.joinedGame == null));
        // Check correct password
        this.isValid = (this.isValid && (this.gamePassword === this.joinedGame.gamePassword));
        // Print message
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("join game action being launched");
        // Add the game creator as the first player of the game and Admin permissions
        this.joinedGame.gameData.addUser(this.requester);
        // Add game Id to the user data set
        this.requester.joinGame(this.joinedGame.gameId);
    }

    private checkUserRegisteredInGame(): boolean {
        // Checks if the user is registered in any game in the server
        let foundUser = false
        this.serverData.games.forEach( (game) => {
            if (foundUser) return;
            game.users.forEach( (user) => {
                if (user.Id === this.requester.Id) {
                    foundUser = true;
                    return;
                }
            })
        })
        return foundUser;
    }
}