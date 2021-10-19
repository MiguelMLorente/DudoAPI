import { Bid } from "../../gameData/Bid";
import { Game } from "../../gameData/Game";
import { ServerData } from "../../ServerData";
import { User } from "../../userData/User";
import { ActionType } from "../../utils/ActionType";
import getEndOfRoundResponse from "../../utils/Builders/ResponseBuilder/EndOfRoundResponse";
import getErrorResponse from "../../utils/Builders/ResponseBuilder/ErrorResponse";
import { Response } from "../../utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../utils/ErrorMessage";
import { GameStatus } from "../../utils/GameStatus";
import { Action } from "../Action";

export class SpotOnAction extends Action {
    game: Game;
    currentBid?: Bid;
    winner?: User;
    loser?: User;

    constructor(requester: User, serverData: ServerData, game: Game) {
        super(requester, serverData,);
        this.game = game;
        this.currentBid = this.game.currentBid;
    };

    public validate(): void {
        if (this.game == null) {
            // Game  must not be null
            this.errorMessage = ErrorMessage.GAME_NOT_FOUND;
        } else if (this.game.status !== GameStatus.CURRENT) {
            // Game must have started
            this.errorMessage = ErrorMessage.GAME_NOT_STARTED;
        } else if (this.game.activeRound === false) {
            // Round must be active
            this.errorMessage = ErrorMessage.ROUND_NOT_ACTIVE;
        } else if (!this.requester.isActive) {
            // Check if the users bidding turn is correct
            this.errorMessage = ErrorMessage.NOT_TURN;
        } else if (this.currentBid === undefined) {
            // If there is not a current bid, user cannot accept it
            this.errorMessage = ErrorMessage.SPOT_NO_BID;
        } else {
            this.isValid = true;
        }

        let message: String = (this.isValid ? "validated" : "invalid") + " spot on action";
        console.log(message);
    }

    public launch(): void {
        // Find winner: if there are exactly as many dice of the bidded quantity
        // with on the bidded value, the bidder loses, else, the caller loses
        let numberOfDice: number = this.game.howManyDice(this.game.currentBid!.value);
        if (numberOfDice === this.game.currentBid!.number) {
            this.winner = this.game.getCurrentPlayer();
            this.loser = this.game.getPreviousPlayer();
        } else {
            this.winner = this.game.getPreviousPlayer();
            this.loser = this.game.getCurrentPlayer();
        }

        // Remove a dice to the loser
        this.loser.numberOfDice--;

        // Remove player if no dice are left
        if (this.loser.numberOfDice === 0) {
            this.loser.isAlive = false;
            this.game.alivePlayers --;
        }

        // TO DO: check if the game has a winner after this


        // Transfer turn to the loser
        this.game.setNextPlayer(this.loser);
        this.game.endRound();
    }

    public response(): Response {
        if (this.isValid) {
            // Respond by revealing the dice values and the winner of the action
            return getEndOfRoundResponse(this.game, this.winner!, this.loser!, this.requester, ActionType.SPOT_ON);
        } else {
            return getErrorResponse(this.requester, this.errorMessage);
        }
    }
}