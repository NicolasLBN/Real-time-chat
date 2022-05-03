const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Holla zibro</h1>')
})

let userlist = new Map();

io.on('connection', (socket) => {
    let userName = socket.handshake.query.userName;
    addUser(userName, socket.id)

    socket.broadcast.emit('user-list', [...userlist.keys()]);
    socket.emit('user-list', [...userlist.keys()]);

    socket.on('message', (msg) => {
        socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
    })

    socket.on('disconnect', (reason) => {
        removeUser(userName, socket.id);
    })
})

function addUser(userName, id) {
    if(!userlist.has(userName)) {
        userlist.set(userName, new Set(id));
    } else {
        userlist.get(userName).add(id);
    }
}

function removeUser(userName, id) {
    if (userList.has(userName)){
        let userIds = userList.get(userName);
        if (!userIds.size) {
            userList.delete(userName)
        }
    }
}

http.listen(3000, () => {
    console.log('Server is running');
})