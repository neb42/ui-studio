#!/usr/bin/env node

import * as http from 'http';
import path from 'path';
import { writeFileSync, readFileSync } from 'fs';

import cors from 'cors';
import express from 'express';
import socketio from 'socket.io';
import { run as generateCode } from '@ui-builder/code-generator';

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

    socket.on('elements-updated', async (elements) => {
      await generateCode(elements, FUNCTIONS_PATH, true);
      socket.emit('code-updated');
      writeFileSync(clientJsonPath, JSON.stringify(elements, null, 4));
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
