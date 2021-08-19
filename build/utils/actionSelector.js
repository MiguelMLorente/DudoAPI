"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectAction = void 0;
var ActionType_1 = require("./ActionType");
var ExampleBidAction_1 = __importDefault(require("./ExampleActions/ExampleBidAction"));
var ExampleCreateGame_1 = __importDefault(require("./ExampleActions/ExampleCreateGame"));
var ExampleJoinGame_1 = __importDefault(require("./ExampleActions/ExampleJoinGame"));
var ExampleRaiseAction_1 = __importDefault(require("./ExampleActions/ExampleRaiseAction"));
function selectAction(type) {
    switch (type) {
        case ActionType_1.ActionType.BID:
            return ExampleBidAction_1.default;
        case ActionType_1.ActionType.RAISE:
            return ExampleRaiseAction_1.default;
        case ActionType_1.ActionType.CREATE_GAME:
            return ExampleCreateGame_1.default;
        case ActionType_1.ActionType.JOIN_GAME:
            return ExampleJoinGame_1.default;
    }
}
exports.selectAction = selectAction;
