export class PlayerInfo {
    playerName: String;
    isActive: boolean;
    isAlive: boolean;
    diceNumber?: number;
    diceValue?: Array<number>;

    constructor(name: String, active: boolean, alive: boolean, diceNumber?: number, diceValue?: Array<number>) {
        this.playerName = name;
        this.isActive = active;
        this.isAlive = alive;
        this.diceNumber = diceNumber;
        this.diceValue = diceValue;
    }
}