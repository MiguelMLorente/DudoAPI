type Requester = {
    uuid: String;
    name?: String;
}

type ActionData = {
    gameId?: String;
    userId: String;
    kickedUser?: String;
    promotedUser?: String;
    selectedOption?: String;
    diceValue?: number;
    diceQuantity?: number;
    gameName?: String;
    gamePassword?: String;
    ready?: boolean;
}

export type UserAction = {
    requester: Requester;
    actionType: String;
    actionData: ActionData;
}