#!/usr/bin/env node

import * as http from 'http';
import path from 'path';

import cors from 'cors';
import express from 'express';
import socketio from 'socket.io';
import { run as generateCode } from '@ui-builder/code-generator';

import { PORT, FUNCTIONS_PATH } from './options';
import { initCode } from './preview';

const run = async () => {
  await initCode();

  const app = express();
  app.use(cors());

  const server = http.createServer(app);

  const io = socketio(server);
  io.origins(['http://localhost:3003']);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('elements-updated', (elements) => {
      generateCode(elements, FUNCTIONS_PATH, true);
    });
  });

  app.use(express.static(path.join(__dirname, 'client')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });

  server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
  });
};

run();
