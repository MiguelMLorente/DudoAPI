import { type } from "os";

type Requester = {
    uuid: String;
    name: String;
}

type ActionData = {
    gameId: String;
    userId: String;
    kickedUser?: String;
    promotedUser?: String;
    selectedOption?: String;
    diceValue: number;
    diceQuantity: number;
}

export type UserAction = {
    requester: Requester;
    actionType: String;
    actionData: ActionData;
}