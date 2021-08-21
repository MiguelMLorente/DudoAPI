"use strict";
// Initialize server
// Wait for connections
// Wait for orders
// Update data status
// Send (if applicable) data to clients
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var ServerData_1 = require("./ServerData");
var http_1 = require("http");
var ResquestHandler_1 = require("./serverActions/ResquestHandler");
var CreateUser_1 = require("./serverActions/CreateUser");
var server = http_1.createServer();
var io = new socket_io_1.Server(server, { cors: { origin: "*" } });
var serverData = new ServerData_1.ServerData();
io.on('connection', function (socket) {
    // create new User
    serverData.users.push(CreateUser_1.createUser(socket));
    socket.send("hello new user");
    // handle new User request
    socket.on('action', function (action) {
        console.log(action);
        console.log(serverData);
        ResquestHandler_1.handleRequest(action, serverData);
        //sendGameStatus();
        io.emit('message', "hola, me has mandado una accion");
        console.log("Nuevo status del servidor: ");
        console.log(serverData);
    });
    // send status update
});
server.listen(8080, function () { return console.log("listening"); });
