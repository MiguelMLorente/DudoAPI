"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User() {
        this.clientId = "";
        this.userName = "";
    }
    ;
    Object.defineProperty(User.prototype, "Id", {
        get: function () {
            return this.clientId;
        },
        enumerable: false,
        configurable: true
    });
    return User;
}());
exports.User = User;
