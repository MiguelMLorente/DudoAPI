export function postRoundAction(action: any): any {
    let postRoundAction = {
        "requester": {
          "uuid": "internal",
        },
        "actionType": "POST ROUND",
        "actionData": {
          "gameId": "",
        }
    }
    console.log(action);
    postRoundAction.actionData.gameId = action.actionData.gameId;
    return postRoundAction;
}