"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaiseAction = void 0;
var GameAction_1 = require("./GameAction");
var RaiseAction = /** @class */ (function (_super) {
    __extends(RaiseAction, _super);
    function RaiseAction(requester, serverData, game) {
        return _super.call(this, requester, serverData, game) || this;
    }
    ;
    RaiseAction.prototype.validate = function () {
        console.log("action being validated");
        this.isValid = true;
        // check if the quantity and values are admisible in the current game state
        // TO-DO
        var message = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    };
    RaiseAction.prototype.launch = function () {
        console.log("action being launched");
    };
    return RaiseAction;
}(GameAction_1.GameAction));
exports.RaiseAction = RaiseAction;
