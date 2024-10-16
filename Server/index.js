// Import required modules
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectToMongo = require('./config/database');
const User = require('./models/User');
require('dotenv').config();

// Define constants
const port = process.env.PORT || 3001;
const maxRetries = 3; // Maximum retries for database operations
const retryDelay = 500; // Retry delay in milliseconds

// Connect to MongoDB with retries
async function connectToMongoWithRetries() {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      connectToMongo();
      return;
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      retries++;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  console.error('Failed to connect to MongoDB after max retries');
  process.exit(1);
}

// Create Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));

// Create HTTP server
const httpServer = http.createServer(app);

// Define routes
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/chats', require('./routes/Chats'));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to chat-bird');
});

// Define socket.io server
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

// Socket.io event listeners
io.on('connection', (socket) => {
  console.log('Socket connected');

  // Handle setup event
  socket.on('setup', async (user) => {
    console.log('Setup event fired for user:', user);
    socket.join(user.id);
    socket.userId = user.id;
    try {
      await User.findByIdAndUpdate(user.id, { online: true });
      socket.emit('connected');
      io.emit('update-status', { userId: user.id, online: true });
    } catch (error) {
      console.error(`Error updating user online status: ${error.message}`);
    }
  });

  // Handle chat event
  socket.on('chat', (chatId) => {
    socket.join(chatId);
    console.log(`User  joined chat with ID: ${chatId}`);
  });

  // Handle new message event
  socket.on('new message', async (message) => {
    const chat = message.chat;

    if (!chat?.members) {
      console.log('Members are not defined');
      return;
    }

    try {
      // Use a Set to avoid duplicates and improve performance
      const memberSet = new Set(chat.members);
      memberSet.delete(message.sender); // Remove sender from the set

      // Emit message to each member
      memberSet.forEach((member) => {
        socket.in(member).emit('received', message);
      });
    } catch (error) {
      console.error(`Error sending message to chat members: ${error.message}`);
    }
  });

  // Handle disconnect event
  socket.on('disconnect', async () => {
    const userId = socket.userId;
    console.log('Disconnect event fired for user:', userId);
    const lastOnline = new Date();

    try {
      await User.findByIdAndUpdate(userId, { online: false, lastOnline });
      io.emit('update-status', { userId, online: false, lastOnline });
    } catch (error) {
      console.error(`Error updating user online status: ${error.message}`);
    }
  });

  // Handle error event
  socket.on('error', (error) => {
    console.error(`Socket error: ${error.message}`);
  });
});

// Start server
connectToMongoWithRetries().then(() => {
  httpServer.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}).catch((error) => {
  console.error(`Error starting server: ${error.message}`);
  process.exit(1);
});