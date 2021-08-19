import { Action } from "../actionables/Action";
import { ActionBuilder } from "../utils/Builders/ActionBuilder/ActionBuilder";

export function handleRequest(message: any) {
    try {
        let action: Action = new ActionBuilder(message).build();
        action.validate();
        action.launch();
    } catch(e) {
        console.log(e);
        console.log("Error handling the client request. Malformed json response");
    }
}