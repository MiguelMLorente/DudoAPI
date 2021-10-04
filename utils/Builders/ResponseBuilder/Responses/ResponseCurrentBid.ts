export class CurrentBid {
    diceValue: number;
    diceNumber: number;
    doneBy: String;

    constructor(diceValue: number, diceNumber: number, doneBy: String) {
        this.diceNumber = diceNumber;
        this.diceValue = diceValue;
        this.doneBy = doneBy;
    }
}