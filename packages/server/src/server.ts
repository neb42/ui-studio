#!/usr/bin/env node

import * as http from 'http';
import path from 'path';
import { writeFileSync, readFileSync } from 'fs';

import cors from 'cors';
import express from 'express';
import socketio from 'socket.io';

import { getOptions } from './options';
import { initCode } from './preview';

const run = async (): Promise<void> => {
  const {
    SERVER_PORT,
    FUNCTIONS_PATH,
    PREVIEW_CLIENT_PORT,
    PREVIEW_SERVER_PORT,
  } = await getOptions();

  await initCode();

  const app = express();
  app.use(cors());

  const server = http.createServer(app);

  const io = socketio(server);
  io.origins('*:*');

  io.on('connection', (socket) => {
    const clientJsonPath = path.join(FUNCTIONS_PATH, 'client.json');
    const clientJson = JSON.parse(readFileSync(clientJsonPath).toString());

    socket.emit('init-client', clientJson);

    socket.emit('set-server', {
      host: 'http://localhost',
      serverPort: PREVIEW_SERVER_PORT,
      clientPort: PREVIEW_CLIENT_PORT,
    });

    socket.on('init-builder', (r) => {
      socket.broadcast.emit('init-builder', r);
    });

    socket.on('elements-updated', async (elements) => {
      socket.broadcast.emit('update-tree', elements);
      writeFileSync(clientJsonPath, JSON.stringify(elements, null, 4));
    });

    socket.on('navigate-page', (r) => {
      socket.broadcast.emit('navigate-page', r);
    });

    socket.on('select-element', (r) => {
      socket.broadcast.emit('select-element', r);
    });

    socket.on('hover-element', (r) => {
      socket.broadcast.emit('hover-element', r);
    });
  });

  app.use(express.static(path.join(__dirname, 'client')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });

  server.listen(SERVER_PORT, () => {
    console.log(`listening on *:${SERVER_PORT}`);
  });
};

run();