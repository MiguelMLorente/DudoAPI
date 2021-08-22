import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { Response } from "../../../utils/Responses/ResponseModel";
import { ClientAction } from "../ClientAction";

export class JoinGameAction extends ClientAction {
    gameName: String;
    gamePassword: String;
    userName: String;
    joinedGame: Game;

    constructor(requester: User, gameName: String, gamePassword: String, userName: String, serverData: ServerData, joinedGame: Game) {
        super(requester, serverData);
        this.gameName = gameName;
        this.gamePassword = gamePassword;
        this.userName = userName;
        this.joinedGame = joinedGame;
    };

    public validate(): void {
        console.log("join game action being validated");
        super.validate();
        // User must not be registered in any game in order to create a new game
        this.isValid = (this.isValid && !this.checkUserRegisteredInGame());
        // User name must not be empty
        this.isValid = (this.isValid && (this.userName != ""));
        // Check valid game
        this.isValid = (this.isValid && !(this.joinedGame == null));
        // Check correct password
        console.log(this.isValid)
        this.isValid = (this.isValid && (this.gamePassword === this.joinedGame.password));
        // Print message
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("join game action being launched");
        // Set user name
        this.requester.setUserName(this.userName);
        // Add the game creator as the first player of the game and Admin permissions
        this.joinedGame.addUser(this.requester);
        // Add game Id to the user data set
        this.requester.joinGame(this.joinedGame.gameId);
    }
    
    public response(): Response {
        if (this.joinedGame !== null) {
            return new Response('joined-game', 'Joined game! :)', this.joinedGame.gameId)
        } else {
            return new Response('error', 'Error: Game does not exist')
        }
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