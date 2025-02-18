

let users: any[] = [];

const addUsers = (socketId: string, userId: string) => {
    let user = users.find(user => user.userId === userId);

    if (user) {
        user.socketId = socketId;  // Update the existing user's socketId
    } else {
        // Add a new user to the list if not found
        users.push({ userId, socketId });
    }
}

const removeUser = (socketId: any) => { // Corrected parameter name
    users = users.filter((user) => user.socketId !== socketId);
}

export const appMessages = (socket: any, socketIo: any) => {
    socket.on("addUser", (user: any) => {
        addUsers(socket.id, user.id);  // Reversed arguments for addUsers

        // Emit updated user list after adding/updating a user
        socketIo.emit("getUsers", users); // Emit updated list to all connected clients
        socketIo.emit("activeUsers", users);
         // Optionally, emit the active users list
         socket.on("disconnect",()=>{
            setTimeout(()=>{
                if(socket.connected){
                    removeUser(socket.id);
                    socketIo.emit("getUsers",users);
                    socket.broadcast.emit("activeUsers",users)
                }
            },5000)
         })
    });
}
