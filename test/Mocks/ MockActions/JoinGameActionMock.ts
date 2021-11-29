let correctAction1 = {
    "requester": {
        "uuid": "486cae9d-dc1c-4e22-9a76-d0a120442f7d",
        "name": "UserName-1"
    },
    "actionType": "JOIN GAME",
    "actionData": {
        "gameShortId": "",
        "gamePassword": "Password-1"
    }
}

let correctAction2 = {
    "requester": {
        "uuid": "b378d887-b05a-402a-b758-afe9399587ef",
        "name": "UserName-2"
    },
    "actionType": "JOIN GAME",
    "actionData": {
        "gameShortId": "",
        "gamePassword": "Password-1"
    }
}

let correctAction3 = {
    "requester": {
        "uuid": "44daca2c-4ea7-48c8-9563-b0f12ce6c6f9",
        "name": "UserName-3"
    },
    "actionType": "JOIN GAME",
    "actionData": {
        "gameShortId": "",
        "gamePassword": "Password-1"
    }
}

let faultyAction1 = {
    "requester": {
        "uuid": "",
        "name": "UserName-2"
    },
    "actionType": "JOIN GAME",
    "actionData": {
        "gameShortId": "",
        "gamePassword": "Password-1"
    }
}

let faultyAction2 = {
    "requester": {
        "uuid": "b378d887-b05a-402a-b758-afe9399587ef",
        "name": ""
    },
    "actionType": "JOIN GAME",
    "actionData": {
        "gameShortId": "",
        "gamePassword": "Password-1"
    }
}

let faultyAction3 = {
    "requester": {
        "uuid": "b378d887-b05a-402a-b758-afe9399587ef",
        "name": "UserName-2"
    },
    "actionType": "JOIN GAME",
    "actionData": {
        "gameShortId": "",
        "gamePassword": "Password-1"
    }
}

let faultyAction4 = {
    "requester": {
        "uuid": "b378d887-b05a-402a-b758-afe9399587ef",
        "name": "UserName-2"
    },
    "actionType": "JOIN GAME",
    "actionData": {
        "gameShortId": "",
        "gamePassword": "WrongPassword"
    }
}

let emptyAction = {
    "requester": {
        "uuid": "",
        "name": ""
    },
    "actionType": "JOIN GAME",
    "actionData": {
        "gameShortId": "",
        "gamePassword": "Password-1"
    }
}

export { correctAction1, 
    correctAction2, 
    correctAction3, 
    faultyAction1, 
    faultyAction2, 
    faultyAction3, 
    faultyAction4,
    emptyAction };