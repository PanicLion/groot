const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./helper/formatMsg');
const {
    getCurrentUser,
    getActiveUsers,
    leaveRoom,
    newUser
} = require('./helper/userHelper');

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
    socket.on('joinRoom', ({ userName, room }) => {
        const user = newUser(socket.id, userName, room);

        socket.join(user.room);
        socket.emit('message', formatMessage("Groot", "I am Groot! "), 'chat-left');

        socket.broadcast
            .to(user.room)
            .emit(
                'message', 
                formatMessage("Groot", `${user.userName} has joined the room`),
                'chat-left'
            );
        
        io.to(user.room).emit('activeUsers', {
            room: user.room,
            users: getActiveUsers(user.room)
        });
    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.userName, msg), '');
    });

    socket.on('disconnect', () => {
        const user = leaveRoom(socket.id);
        if (user) {
            io.to(user.room).emit(
                "message", 
                formatMessage("Groot", `${user.userName} has left the room`),
                "chat-left"
            );

            io.to(user.room).emit('activeUsers', {
                room: user.room,
                users: getActiveUsers(user.room)
            })
        }
    });

    // TODO: Private Chat between two users
    

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});
