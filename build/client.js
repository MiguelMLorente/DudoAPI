"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var socket = new socket_io_1.WebSocket('ws://localhost:8080');
socket.onmessage = function (_a) {
    var data = _a.data;
    console.log("Message received from the server");
};
