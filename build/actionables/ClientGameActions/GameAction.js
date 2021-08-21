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
exports.GameAction = void 0;
var Action_1 = require("../Action");
var GameAction = /** @class */ (function (_super) {
    __extends(GameAction, _super);
    function GameAction(requester, serverData, game) {
        var _this = _super.call(this, requester, serverData) || this;
        _this.game = game;
        return _this;
    }
    ;
    GameAction.prototype.validate = function () {
        this.isValid = true;
    };
    return GameAction;
}(Action_1.Action));
exports.GameAction = GameAction;
