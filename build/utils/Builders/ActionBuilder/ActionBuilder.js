"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionBuilder = void 0;
var ActionType_1 = require("../../ActionType");
var BidActionBuilder_1 = require("./BidActionBuilder");
var CreateGameActionBuilder_1 = require("./CreateGameActionBuilder");
var RaiseActionBuilder_1 = require("./RaiseActionBuilder");
var ActionBuilder = /** @class */ (function () {
    function ActionBuilder(json, serverData) {
        this.jsonAction = json;
        this.serverData = serverData;
    }
    ActionBuilder.prototype.build = function () {
        switch (this.jsonAction.actionType) {
            case ActionType_1.ActionType.BID:
                return new BidActionBuilder_1.BidActionBuilder(this.jsonAction).build();
            case ActionType_1.ActionType.RAISE:
                return new RaiseActionBuilder_1.RaiseActionBuilder(this.jsonAction).build();
            case ActionType_1.ActionType.CREATE_GAME:
                return new CreateGameActionBuilder_1.CreateGameActionBuilder(this.jsonAction, this.serverData).build();
            default:
                return new BidActionBuilder_1.BidActionBuilder(this.jsonAction).build();
        }
    };
    return ActionBuilder;
}());
exports.ActionBuilder = ActionBuilder;
