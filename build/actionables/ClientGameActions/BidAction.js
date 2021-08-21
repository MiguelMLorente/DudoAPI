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
exports.BidAction = void 0;
var GameAction_1 = require("./GameAction");
var BidAction = /** @class */ (function (_super) {
    __extends(BidAction, _super);
    function BidAction(requester, serverData, game, diceQuantity, diceValue) {
        var _this = _super.call(this, requester, serverData, game) || this;
        _this.diceQuantity = diceQuantity;
        _this.diceValue = diceValue;
        return _this;
    }
    ;
    BidAction.prototype.validate = function () {
        console.log("action being validated");
        _super.prototype.validate.call(this);
        // check if diceValue is correct
        this.isValid = (this.isValid && ((this.diceValue > 0) && (this.diceValue <= 6)));
        this.isValid = (this.isValid && (this.diceValue % 1 === 0));
        // check if diceQuantity is correct
        this.isValid = (this.isValid && (this.diceQuantity > 0));
        this.isValid = (this.isValid && (this.diceQuantity % 1 === 0));
        // check if the quantity and values are admisible in the current game state
        // TO-DO
        var message = this.isValid ? "validated action" : "invalid action";
        console.log(message);
    };
    BidAction.prototype.launch = function () {
        console.log("action being launched");
    };
    return BidAction;
}(GameAction_1.GameAction));
exports.BidAction = BidAction;
