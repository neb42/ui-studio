import * as http from 'http';
import { exec } from 'child_process';

import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';
import { run as generateCode } from '@ui-builder/code-generator';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3002;

const basePath = '/Users/bmcalindin/Desktop/generatedCode';

io.origins(['http://localhost:3003']);

generateCode(basePath, 'Appname', {
  datasets: {},
  queries: {},
  serverFunctions: {},
  clientFunctions: {},
  widgets: {},
  layouts: {},
  pages: {},
});

const he = (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
};

let devServer;
exec('yarn', { cwd: '/Users/bmcalindin/Desktop/generatedCode/server' }, he).on('exit', (code) => {
  devServer = exec('yarn dev', { cwd: '/Users/bmcalindin/Desktop/generatedCode/server' }, he);
});

let devClient;
exec('yarn', { cwd: '/Users/bmcalindin/Desktop/generatedCode/client' }, he).on('exit', (code) => {
  devClient = exec('yarn start', { cwd: '/Users/bmcalindin/Desktop/generatedCode/client' }, he);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('elements-updated', (elements) => {
    generateCode('Appname', elements);
    // console.log(elements);
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
