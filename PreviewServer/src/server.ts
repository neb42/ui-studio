import * as express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  socket.on('elements-updated', (elements) => {
    generateCode(elements);
  });
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});