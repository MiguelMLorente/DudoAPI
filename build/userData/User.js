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
    User.prototype.setUserName = function (name) {
        if (this.userName)
            throw new Error("User name already exists, cannot be rewritten");
        this.userName = name;
    };
    return User;
}());
exports.User = User;
