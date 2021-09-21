import { User } from "../userData/User";
import { GameStatus } from "../utils/GameStatus";
import { v4 as uuid } from "uuid";
import { Bid } from "./Bid";

export class Game {
    private id: String;
    private playerList: Array<User>;
    private gameStatus: String;
    public gameHistory: Array<String>;
    private gameName: String;
    private gamePassword: String;
    public numberOfPlayers: number;
    private currentPlayer: number;
    public currentBid?: Bid;

    constructor(name: String, password: String) {
        this.id = uuid();
        this.playerList = [];
        this.gameStatus = GameStatus.NOT_STARTED;
        this.gameHistory = []
        this.gameName = name;
        this.gamePassword = password;
        this.numberOfPlayers = 0;
        this.currentPlayer = 0;
        this.currentBid = undefined;

    }

    public startGame() {
        this.gameStatus = GameStatus.CURRENT;
        this.numberOfPlayers = this.playerList.length;
        this.startRound();
    }

    private startRound() {
        this.setStartingPlayer();
        this.playerList.forEach((player) => {
            player.rollDice()
        })
    }

    private setStartingPlayer(): void {
        // Initialize the player that starts.
        if (this.currentPlayer === 0) {
            this.currentPlayer = Math.floor(Math.random() * this.numberOfPlayers);
            this.playerList[this.currentPlayer].isActive = true;
        } else {
            this.playerList[this.currentPlayer].isActive = false;
            this.currentPlayer = Math.floor(Math.random() * this.numberOfPlayers);
            this.playerList[this.currentPlayer].isActive = true;
        }
    }

    public setNextPlayer(newNextPlayer?: User): void {
        if (newNextPlayer === undefined) {
            let nextPlayer: number = this.currentPlayer + 1;
            if (nextPlayer === this.numberOfPlayers) nextPlayer = 0
            this.playerList[this.currentPlayer].isActive = false;
            this.playerList[nextPlayer].isActive = true;
            this.currentPlayer = nextPlayer;
        } else {
            let i: number = 0;
            this.playerList.forEach((player) => {
                if (player === newNextPlayer) {
                    player.isActive = true;
                    this.currentPlayer = i;
                } else {
                    player.isActive = false;
                    i++;
                }
            })
        }
        if (this.playerList[this.currentPlayer].isAlive === false) {
            this.setNextPlayer();
        }
    }

    public addUser(user: User): void {
        this.playerList.push(user);
        this.numberOfPlayers++;
    }

    get gameId(): String {
        return this.id;
    }

    get users(): Array<User> {
        return this.playerList;
    }

    get name(): String {
        return this.gameName;
    }

    get password(): String {
        return this.gamePassword;
    }

    get status(): String {
        return this.gameStatus;
    }

    public howManyDice(num: number): number {
        let allDice: Array<number> = []
        this.playerList.forEach((player) => {
            allDice.concat(player.diceValues)
        });
        return allDice.reduce((diceVal) => (((diceVal === 1) || (diceVal === num)) ? 1 : 0));
    }

    public getCurrentPlayer(): User {
        return this.playerList[this.currentPlayer];
    }

    public getPreviousPlayer(): User {
        return this.currentBid!.doneBy;
    }
}