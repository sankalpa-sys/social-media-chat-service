require('dotenv').config();
const io = require("socket.io")(8900, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN,
    }
})

//socket connection


let users = [];
const addUser = (userId, socketId)=> {
    !users.some(user=> user.userId === userId) &&
    users.push({userId, socketId})
}

const removeUser = (socketId)=> {
    users = users.filter(user=> user.socketId !== socketId)
}
io.on("connection", (socket)=> {
    socket.on("addUser", (userId)=> {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })
    socket.on("sendMessage", ({senderId, receiverId, text})=> {
        console.log(users)
        console.log("senderId", senderId)
        console.log("receiverId", receiverId)

        console.log("text", text)
        const user = users?.find(user=> user?.userId === receiverId)
        if(user){
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text
            })
        }
    })
    socket.on("disconnect", ()=> {
        removeUser(socket.id)
        console.log("a user disconnected");
    })
})