import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import getErrorResponse from "../../../utils/Builders/ResponseBuilder/ErrorResponse";
import getJoinedGameResponse from "../../../utils/Builders/ResponseBuilder/JoinedGameResponse";
import { Response } from "../../../utils/Builders/ResponseBuilder/Responses/Response";
import { ClientAction } from "../ClientAction";

export class CreateGameAction extends ClientAction {
    gameName: String;
    gamePassword: String;
    userName: String;
    game?: Game;

    constructor(requester: User, gameName: String, gamePassword: String, userName: String, serverData: ServerData) {
        super(requester, serverData);
        this.gameName = gameName;
        this.gamePassword = gamePassword;
        this.userName = userName;
    };

    public validate(): void {
        console.log("create game action being validated");
        super.validate();
        // Game name must not be empty
        this.isValid = (this.isValid && (this.gameName !== ""));
        // User name must not be empty
        this.isValid = (this.isValid && (this.userName != ""));
        // User must not be registered in any game in order to create a new game
        this.isValid = (this.isValid && !this.checkUserRegisteredInGame());
        // Print message
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("create game action being launched");
        // Set user name
        this.requester.setUserName(this.userName);
        // Create new game with the given name and password
        let game: Game = new Game(this.gameName, this.gamePassword);
        // Add the game creator as the first player of the game and Admin permissions
        game.addUser(this.requester);
        this.requester.grantAdminPermisions();
        // Add game Id to the user data set
        this.requester.joinGame(game.gameId);
        // Add the game to the game list in the server data base
        this.serverData.games.push(game)
        this.game = game;
    }

    public response(): Response {
        if (this.game !== undefined) {
            return getJoinedGameResponse(this.requester, this.game.gameId);
        } else {
            return getErrorResponse(this.requester);
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