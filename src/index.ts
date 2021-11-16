// Initialize server
// Wait for connections
// Wait for orders
// Update data status
// Send (if applicable) data to clients

import { Server } from 'socket.io';
import { ServerData } from "./ServerData";
import { createServer } from "http";
import { handleRequest } from './serverActions/ResquestHandler';
import { createUser } from './serverActions/CreateUser';
import { handleDisconnect } from './serverActions/DisconnectHandler';


let server = createServer();
let io = new Server(server, {cors: {origin: "*"}})


let serverData: ServerData = new ServerData();

io.on('connection', socket => {
    // create new User
    createUser(socket, serverData);
    
    // handle new User request
    socket.on('action', action => {
        handleRequest(action, serverData, io);
    })

    socket.on('disconnect', () => {
        handleDisconnect(socket.id, serverData, io);
    });
})

server.listen(8081, () => console.log("listening"));
