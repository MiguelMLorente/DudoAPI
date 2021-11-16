import { User } from "../userData/User";
import { GameStatus } from "../utils/Enums/GameStatus";
import { v4 as uuid } from "uuid";

import { Bid } from "./Bid";

export class Game {
    static maxPlayers: number = 8;
    private id: String;
    private playerList: Array<User>;
    private gameStatus: String;
    public gameHistory: Array<String>;
    private gameShortId: String;
    private gamePassword: String;
    public numberOfPlayers: number;
    public alivePlayers: number;
    private currentPlayer: number;
    public currentBid?: Bid;
    public activeRound: boolean;
    public winner?: User;

    constructor(shortId: String, password: String) {
        this.id = uuid();
        this.playerList = [];
        this.gameStatus = GameStatus.NOT_STARTED;
        this.gameHistory = [];
        this.gameShortId = shortId;
        this.gamePassword = password;
        this.numberOfPlayers = 0;
        this.alivePlayers = 0;
        this.currentPlayer = 0;
        this.currentBid = undefined;
        this.activeRound = false;
    }

    public startGame() {
        this.gameStatus = GameStatus.CURRENT;
        this.numberOfPlayers = this.playerList.length;
        this.alivePlayers = this.numberOfPlayers;
        this.startRound(true);
    }

    public startRound(isFirstRound: boolean) {
        this.currentBid = undefined;
        if (isFirstRound) {
            this.setStartingPlayer();
        }
        this.playerList.forEach((player) => {
            player.rollDice()
        })
        this.activeRound = true;
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

    public endRound(): void {
        this.activeRound = false;
    }

    public addUser(user: User): void {
        this.playerList.push(user);
        this.numberOfPlayers++;
    }

    public removePlayer(user: User): void {
        const index = this.playerList.indexOf(user);
        if (index > -1) {
            this.playerList.splice(index, 1);
            this.numberOfPlayers--;
        }
    }

    get gameId(): String {
        return this.id;
    }

    get users(): Array<User> {
        return this.playerList;
    }

    get shortId(): String {
        return this.gameShortId;
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
            allDice = allDice.concat(player.diceValues)
        });
        return allDice.filter(diceVal => ((diceVal === 1) || (diceVal === num))).length;
    }

    public getCurrentPlayer(): User {
        return this.playerList[this.currentPlayer];
    }

    public getPreviousPlayer(): User {
        return this.currentBid!.doneBy;
    }

    public endGame(): void {
        this.gameStatus = GameStatus.FINISHED;
        this.winner = this.playerList.filter( (player) => player.isAlive )[0];
    }

    public areAllPlayersReady(): boolean {
        // If some player is not ready, then the game is not ready to start
        return !this.playerList.some(player => !player.isReady)
    }
}