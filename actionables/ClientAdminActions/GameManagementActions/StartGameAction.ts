import { Game } from "../../../gameData/Game";
import { ServerData } from "../../../ServerData";
import { User } from "../../../userData/User";
import { Response } from "../../../utils/Responses/ResponseModel";
import { ClientAction } from "../ClientAction";

export class StartGameAction extends ClientAction {
    game: Game;

    constructor(requester: User, game: Game, serverData: ServerData) {
        super(requester, serverData);
        this.game = game;
    };

    public validate(): void {
        console.log("start game action being validated");
        super.validate();
        // Game id must exist
        this.isValid = (this.isValid && (this.game !== null));
        // User must be registered in this game in order to start it
        this.isValid = (this.isValid && this.checkUserRegisteredInThisGame());
        // User must be admin to start the game
        this.isValid = (this.isValid && this.requester.isAdmin);
        // Print message
        let message: String = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    }

    public launch(): void {
        console.log("start game action being launched");
        // Create new game with the given name and password
        this.game.startGame();
    }

    public response(): Response {
        if (!this.isValid) {
            return new Response('message', 'Started game! :)')
        } else {
            return new Response('error', 'Error: Game not started')
        }
    }

    private checkUserRegisteredInThisGame(): boolean {
        // Checks if the user is registered in any game in the server
        let foundUser = false
        if (this.game === undefined) return false;
        this.game.users.forEach( (user) => {
            if (foundUser) return;
            if (user.Id === this.requester.Id) foundUser = true;
        })
        return foundUser;
    }
}