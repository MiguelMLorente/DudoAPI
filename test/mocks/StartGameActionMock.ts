let correctAction = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
      "name": "UserName-1"
    },
    "actionType": "START GAME",
    "actionData": {
      "gameId": "",
      "userId": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
    }
}

let faultyAction1 = {
    "requester": {
        "uuid": "",
        "name": "UserName-1"
    },
    "actionType": "START GAME",
    "actionData": {
        "gameId": "",
        "userId": "",
    }
}

let faultyAction2 = {
    "requester": {
        "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
        "name": "UserName-1"
    },
    "actionType": "START GAME",
    "actionData": {
        "gameId": "",
        "userId": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
    }
}

let faultyAction3 = {
    "requester": {
        "uuid": "25654461-043c-4697-90bd-d775ed1a4e35",
        "name": "UserName-4"
    },
    "actionType": "START GAME",
    "actionData": {
        "gameId": "",
        "userId": "25654461-043c-4697-90bd-d775ed1a4e35",
    }
}

let faultyAction4 = {
    "requester": {
        "uuid": "b378d887-b05a-402a-b758-afe9399587ef",
        "name": "UserName-2"
    },
    "actionType": "START GAME",
    "actionData": {
        "gameId": "",
        "userId": "b378d887-b05a-402a-b758-afe9399587ef",
    }
}



  export { correctAction,
    faultyAction1, 
    faultyAction2, 
    faultyAction3, 
    faultyAction4 };