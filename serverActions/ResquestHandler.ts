import { Action } from "../actionables/Action";
import { ServerData } from "../ServerData";
import { ActionBuilder } from "../utils/Builders/ActionBuilder/ActionBuilder";

export function handleRequest(message: any, serverData: ServerData) {
    try {
        let action: Action = new ActionBuilder(message, serverData).build();
        action.validate();
        if (action.Valid) {
            action.launch();
        } else {
            console.log("Invalid action, try again");
        }
        
    } catch(e) {
        console.log(e);
        console.log("Error handling the client request. Malformed json response");
    }
}