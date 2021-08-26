export class ResponseDataModel {
    socketId: String;
    sentData: any;

    constructor(socketId: String, data: any) {
        this.socketId = socketId;
        this.sentData = data;
    }
}