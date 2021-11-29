let correctAction1 = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d"
    },
    "actionType": "PLAYER READY",
    "actionData": {
        "gameId": "",
        "ready": true
    }
}

let correctAction2 = {
    "requester": {
      "uuid": "b378d887-b05a-402a-b758-afe9399587ef"
    },
    "actionType": "PLAYER READY",
    "actionData": {
        "gameId": "",
        "ready": true
    }
}

let correctAction3 = {
    "requester": {
      "uuid": "44daca2c-4ea7-48c8-9563-b0f12ce6c6f9"
    },
    "actionType": "PLAYER READY",
    "actionData": {
        "gameId": "",
        "ready": true
    }
}

let correctAction4 = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d"
    },
    "actionType": "PLAYER READY",
    "actionData": {
        "gameId": "",
        "ready": false
    }
}

let faultyAction1 = {
    "requester": {
        "uuid": ""
      },
      "actionType": "PLAYER READY",
      "actionData": {
        "gameId": "",
          "ready": true
      }
}

let faultyAction2 = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d"
    },
    "actionType": "PLAYER READY",
    "actionData": {
        "gameId": "",
        "ready": true
    }
}

let faultyAction3 = {
    "requester": {
      "uuid": "25654461-043c-4697-90bd-d775ed1a4e35"
    },
    "actionType": "PLAYER READY",
    "actionData": {
        "gameId": "",
        "ready": true
    }
}

let faultyAction4 = {
    "requester": {
      "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d"
    },
    "actionType": "PLAYER READY",
    "actionData": {
        "gameId": "",
        "ready": null
    }
}

let emptyAction = {
    "requester": {
      "uuid": ""
    },
    "actionType": "PLAYER READY",
    "actionData": {
        "gameId": "",
        "ready": true
    }
}
  
export { correctAction1, 
    correctAction2, 
    correctAction3,
    correctAction4,
    faultyAction1,
    faultyAction2,
    faultyAction3,
    faultyAction4,
    emptyAction };