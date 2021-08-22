class ResponseData {
    message?: String;
    gameId?: String;

    constructor(message: String, gameId?: String) {
        this.message = message;
        this.gameId = gameId;
    }
}

export class Response {
    channel: String;
    data: ResponseData;

    constructor(channel: String, message: String, gameId?: String) {
        this.channel = channel;
        this.data = new ResponseData(message, gameId);
    }
}