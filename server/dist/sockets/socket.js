"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appMessages = void 0;
let users = [];
const addUsers = (socketId, userId) => {
    let user = users.find(user => user.userId === userId);
    if (user) {
        user.socketId = socketId; // Update the existing user's socketId
    }
    else {
        // Add a new user to the list if not found
        users.push({ userId, socketId });
    }
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};
const appMessages = (socket, socketIo) => {
    socket.on("addUser", (user) => {
        addUsers(socket.id, user.id); // Reversed arguments for addUsers
        // Emit updated user list after adding/updating a user
        socketIo.emit("getUsers", users); // Emit updated list to all connected clients
        socketIo.emit("activeUsers", users);
        // Optionally, emit the active users list
        socket.on("disconnect", () => {
            setTimeout(() => {
                if (socket.connected) {
                    removeUser(socket.id);
                    socketIo.emit("getUsers", users);
                    socket.broadcast.emit("activeUsers", users);
                }
            }, 5000);
        });
    });
};
exports.appMessages = appMessages;
