"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User() {
        this.clientId = "";
        this.userName = "";
        this.isAdmin = false;
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
        if (this.userName === name)
            return;
        if (this.userName)
            throw new Error("User name already exists, cannot be rewritten");
        this.userName = name;
    };
    Object.defineProperty(User.prototype, "UserName", {
        get: function () {
            return this.userName;
        },
        enumerable: false,
        configurable: true
    });
    User.prototype.grantAdminPermisions = function () {
        this.isAdmin = true;
    };
    return User;
}());
exports.User = User;
