let correctAction = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
      "name": "UserName-1"
    },
    "actionType": "CREATE GAME",
    "actionData": {
        "userId": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
        "gameName": "Game-1",
        "gamePassword": "Password-1"
    }
}

let faultyAction1 = {
    "requester": {
        "uuid": "",
        "name": "UserName-1"
      },
      "actionType": "CREATE GAME",
      "actionData": {
          "userId": "",
          "gameName": "Game-1",
          "gamePassword": "Password-1"
      }
}

let faultyAction2 = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
      "name": ""
    },
    "actionType": "CREATE GAME",
    "actionData": {
        "userId": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
        "gameName": "Game-1",
        "gamePassword": "Password-1"
    }
}

let faultyAction3 = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
      "name": "UserName-1"
    },
    "actionType": "CREATE GAME",
    "actionData": {
        "userId": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
        "gameName": "",
        "gamePassword": "Password-1"
    }
}
  
export { correctAction, 
    faultyAction1, 
    faultyAction2, 
    faultyAction3 };