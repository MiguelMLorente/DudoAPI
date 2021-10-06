import { User } from "../userData/User";

export class Bid {
    value: number;
    number: number;
    doneBy: User;

    constructor(value: number, number: number, doneBy: User) {
        this.value = value;
        this.number = number;
        this.doneBy = doneBy;
    }
}