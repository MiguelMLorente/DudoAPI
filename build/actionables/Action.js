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
    Action.prototype.validate = function () {
        var _this = this;
        // Check that the requester is registered in the data base
        console.log(this.requester);
        if (!this.requester.Id || !this.requester.userName) {
            this.isValid = false;
            return;
        }
        var validUser = false;
        this.serverData.users.forEach(function (user) {
            if (validUser)
                return;
            if (user.Id === _this.requester.Id) {
                validUser = true;
            }
        });
        this.isValid = validUser;
    };
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
