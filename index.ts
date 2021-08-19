// Initialize server
// Wait for connections
// Wait for orders
// Update data status
// Send (if applicable) data to clients

import { Server } from 'socket.io';
import { Action } from "./actionables/Action";
import { ServerData } from "./ServerData";
import { createServer } from "http";
import { ActionBuilder } from "./utils/Builders/ActionBuilder/ActionBuilder";
import { handleRequest } from './serverActions/ResquestHandler';
import { createUser } from './serverActions/CreateUser';


let server = createServer();
let io = new Server(server, {cors: {origin: "*"}})


let serverData: ServerData = new ServerData();

io.on('connection', socket => {
    // create new User
    serverData.users.push(createUser(socket))
    socket.send("hello new user")
    // handle new User request
    socket.on('message', message => {
        console.log(message);
        handleRequest(message);  
        //sendGameStatus();

        io.emit('message', "hola");
    })
    // send status update
    
})

server.listen(8080, () => console.log("listening"));

