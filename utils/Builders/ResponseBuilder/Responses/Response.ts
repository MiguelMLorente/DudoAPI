import { ResponseDataModel } from "./ResponseDataModel";

export class Response {
    channel: String;
    data: Array<ResponseDataModel>;

    constructor(channel: String, data: Array<ResponseDataModel>) {
        this.channel = channel;
        this.data = data;
    }
}