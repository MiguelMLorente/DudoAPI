import { Action } from "../actionables/Action";
import { ServerData } from "../ServerData";
import { ActionBuilder } from "../utils/Builders/ActionBuilder/ActionBuilder";

export function handleRequest(message: any, serverData: ServerData) {
    try {
        let action: Action = new ActionBuilder(message, serverData).build();
        action.validate();
        action.launch();
    } catch(e) {
        console.log(e);
        console.log("Error handling the client request. Malformed json response");
    }
}