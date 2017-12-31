// Global Imports
const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// Local Imports
// nil

// Constants
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath, {}))
io.on('connection', (socket) => {
  console.log('new user connected: ');
  
  socket.on('disconnect', () => {
    console.log('Client Disconnected from Server')
  })
});

// Lastestes
server.listen(PORT, ()=> {
  console.log('Serving on port: ' + PORT);
});