import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { ClientAction } from "../ClientAction";

export class CreateGameAction extends ClientAction {
    gameName: String;
    gamePassword: String;
    requester: User;

    constructor(requester: User, gameName: String, gamePassword: String, serverData: ServerData) {
        super(serverData);
        this.requester = requester;
        this.gameName = gameName;
        this.gamePassword = gamePassword;
    };

    public validate(): void {
        console.log("action being validated");
        super.validate();
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("action being launched");
        let game: Game = new Game(this.gameName, this.gamePassword);
        game.gameData.addUser(this.requester);
        this.serverData.games.push(game)
    }
}