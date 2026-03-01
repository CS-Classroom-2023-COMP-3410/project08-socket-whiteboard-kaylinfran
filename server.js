const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // credentials: true
  }
});

let boardState = [];
let currentUsers = 0;

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  // increment count for new users
  currentUsers += 1;

  // update count of users for all clients
  io.emit('userCount', currentUsers);

  //send updated board state to the new client
  socket.emit('boardState', boardState);

  socket.on('draw', (drawData) => {
    boardState.push(drawData);
    io.emit('draw', drawData);
  });

  socket.on('clear', () => {
    boardState = [];
    io.emit('clear');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    currentUsers -= 1;

    io.emit('userCount', currentUsers);
  });
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
