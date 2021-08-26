import { ResponseDataModel } from "./ResponseDataModel";

export class Response {
    channel: String;
    data: Array<ResponseDataModel>;
    message?: String;

    constructor(channel: String, data: Array<ResponseDataModel>, message?: String) {
        this.channel = channel;
        this.data = data;
        this.message = message;
    }
}