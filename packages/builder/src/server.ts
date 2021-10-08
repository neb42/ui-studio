#!/usr/bin/env node

import * as http from 'http';
import path from 'path';
import { writeFileSync, readFileSync } from 'fs';

import cors from 'cors';
import express from 'express';
import socketio from 'socket.io';
import axios from 'axios';

import { getOptions } from './options';
import { initCode } from './preview';

const run = async (): Promise<void> => {
  const { SERVER_PORT, REPO_PATH, PREVIEW_CLIENT_PORT, PREVIEW_SERVER_PORT } = await getOptions();

  await initCode();

  const app = express();
  app.use(cors());

  app.get('/preview-client-ready', async (request: any, response: express.Response) => {
    try {
      const { status } = await axios.get('http://localhost:3000');
      response.sendStatus(status);
    } catch {
      response.sendStatus(500);
    }
  });

  const server = http.createServer(app);

  const io = socketio(server);
  io.origins('*:*');

  io.on('connection', (socket) => {
    const clientJsonPath = path.join(REPO_PATH, 'client.json');
    const clientJson = JSON.parse(readFileSync(clientJsonPath).toString());

    const packageJsonPath = path.join(REPO_PATH, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
    const { openAPIEndpoint } = packageJson.uiStudio;

    socket.emit('init-client', clientJson);

    socket.emit('set-open-api-endpoint', openAPIEndpoint);

    socket.emit('set-server', {
      host: 'http://localhost',
      serverPort: PREVIEW_SERVER_PORT,
      clientPort: PREVIEW_CLIENT_PORT,
    });

    socket.on('init-builder', (r) => {
      socket.broadcast.emit('init-builder', r);
    });

    socket.on('init-api', (r) => {
      socket.broadcast.emit('init-api', r);
    });

    socket.on('elements-updated', async (elements) => {
      socket.broadcast.emit('update-tree', elements);
      writeFileSync(
        clientJsonPath,
        JSON.stringify({ version: clientJson.version, ...elements }, null, 4),
      );
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
