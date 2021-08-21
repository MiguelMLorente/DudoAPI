"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = void 0;
var ActionBuilder_1 = require("../utils/Builders/ActionBuilder/ActionBuilder");
function handleRequest(message, serverData) {
    try {
        var action = new ActionBuilder_1.ActionBuilder(message, serverData).build();
        action.validate();
        if (action.Valid) {
            action.launch();
        }
        else {
            console.log("Invalid action, try again");
        }
    }
    catch (e) {
        console.log(e);
        console.log("Error handling the client request. Malformed json response");
    }
}
exports.handleRequest = handleRequest;
