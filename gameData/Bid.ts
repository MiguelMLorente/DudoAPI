import { User } from "../userData/User";

export type Bid = {
    value: number;
    number: number;
    doneBy: User;
}