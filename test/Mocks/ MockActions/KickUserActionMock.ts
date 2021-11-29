let correctAction = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
    },
    "actionType": "KICK USER",
    "actionData": {
      "kickedUser": "UserName-2",
      "gameId": ""
    }
}

let faultyAction1 = {
    "requester": {
      "uuid": "b378d887-b05a-402a-b758-afe9399587ef",
    },
    "actionType": "KICK USER",
    "actionData": {
      "kickedUser": "UserName-1",
      "gameId": ""
    }
}

let faultyAction2 = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
    },
    "actionType": "KICK USER",
    "actionData": {
      "kickedUser": "UserName-1",
      "gameId": ""
    }
}

let faultyAction3 = {
    "requester": {
      "uuid": "",
    },
    "actionType": "KICK USER",
    "actionData": {
      "kickedUser": "UserName-2",
      "gameId": ""
    }
}

let faultyAction4 = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
    },
    "actionType": "KICK USER",
    "actionData": {
      "kickedUser": "UserName-2",
      "gameId": ""
    }
}

let faultyAction5 = {
    "requester": {
      "uuid": "25654461-043c-4697-90bd-d775ed1a4e35",
    },
    "actionType": "KICK USER",
    "actionData": {
      "kickedUser": "UserName-2",
      "gameId": ""
    }
}

let faultyAction6 = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
    },
    "actionType": "KICK USER",
    "actionData": {
      "kickedUser": "UserName-4",
      "gameId": ""
    }
}

export { correctAction, 
    faultyAction1,
    faultyAction2,
    faultyAction3,
    faultyAction4,
    faultyAction5,
    faultyAction6 }