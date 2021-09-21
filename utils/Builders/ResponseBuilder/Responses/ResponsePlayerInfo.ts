class PlayerInfo {
    playerName: String;
    isActive: boolean;
    diceNumber?: number;
    diceValue?: Array<number>;

    constructor(name: String, active: boolean, diceNumber?: number, diceValue?: Array<number>) {
        this.playerName = name;
        this.isActive = active;
        this.diceNumber = diceNumber;
        this.diceValue = diceValue;
    }
}