const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');
const connectToMongo = require('./config/database');
require('dotenv').config();
const port = process.env.PORT || 3001

// connecting database 
connectToMongo();

// middlewares 
app.use(express.json());
app.use(cors());

// creating http server from express 
const httpServer = http.createServer(app);

// routes 
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/chats', require('./routes/Chats'));
app.get('/',function(req,res) {
    res.status(200);
    res.send('Welcome to chat-bird')
})

// instantiating socket io server 
const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    }
});

// Emitting and listening all the necessary events of socket 
io.on('connection', (socket) => {
    console.log('socket connected')
    socket.on('setup', (user) => {
        socket.join(user.id);
        socket.emit('connected');
    })
    
    // to make the user join a particular chat 
    socket.on('chat', (chatId) => {
        socket.join(chatId);
        console.log(`user joined using chat id: ${chatId}`);
    })

    // sending and receiving messages 
    socket.on('new message', (message) => {
        var chat = message.chat;

        if(!chat.members) {
            return console.log('members are not defined');
        }

        chat.members.forEach((member) => {
            if(member === message.sender) return;
           
            socket.in(member).emit('received', message);
        })
    })

    // disconnect user from socket or leaves user room 
    socket.off('setup', (user)=> {
        socket.leave(user.id);
    })
});

httpServer.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});