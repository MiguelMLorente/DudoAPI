"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
var crypto_1 = require("crypto");
var Action = /** @class */ (function () {
    function Action(requester, serverData) {
        this.requester = requester;
        this.serverData = serverData;
        this.isValid = true;
        this.id = crypto_1.randomUUID();
    }
    ;
    Object.defineProperty(Action.prototype, "Valid", {
        get: function () {
            return this.isValid;
        },
        enumerable: false,
        configurable: true
    });
    return Action;
}());
exports.Action = Action;
