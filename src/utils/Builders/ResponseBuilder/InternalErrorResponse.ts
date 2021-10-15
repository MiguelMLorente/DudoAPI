import { ResponseChannel } from "../../ResponseChannels";
import { Response } from "./Responses/Response";
import { ResponseDataModel } from "./Responses/ResponseDataModel";

export default function getInternalErrorResponse(): Response {
    return new Response(ResponseChannel.INTERNAL_ERROR, [<ResponseDataModel><unknown>undefined]);
}