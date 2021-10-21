import * as http from 'http';
import path from 'path';
import { writeFileSync, readFileSync } from 'fs';

import cors from 'cors';
import express from 'express';
import socketio from 'socket.io';
import axios from 'axios';

type Args = {
  REPO_PATH: string;
  SERVER_PORT: number;
  PREVIEW_SERVER_PORT: number;
  PREVIEW_CLIENT_PORT: number;
};

export class Server {
  private server: http.Server;

  private port: number;

  public constructor({ REPO_PATH, SERVER_PORT, PREVIEW_SERVER_PORT, PREVIEW_CLIENT_PORT }: Args) {
    const app = this.createApp(PREVIEW_CLIENT_PORT);
    this.server = this.createServer(app);
    this.createWebSocket(this.server, REPO_PATH, PREVIEW_SERVER_PORT, PREVIEW_CLIENT_PORT);
    this.port = SERVER_PORT;
  }

  public start = (): void => {
    this.server.listen(this.port);
  };

  private createApp = (PREVIEW_CLIENT_PORT: number): express.Express => {
    const app = express();

    app.use(cors());

    app.get('/preview-client-ready', async (request: any, response: express.Response) => {
      try {
        const { status } = await axios.get(`http://localhost:${PREVIEW_CLIENT_PORT}`);
        response.sendStatus(status);
      } catch {
        response.sendStatus(500);
      }
    });

    app.use(express.static(path.join(__dirname, 'client')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });

    return app;
  };

  private createServer = (app: express.Express): http.Server => {
    const server = http.createServer(app);
    return server;
  };

  private createWebSocket = (
    server: http.Server,
    REPO_PATH: string,
    PREVIEW_SERVER_PORT: number,
    PREVIEW_CLIENT_PORT: number,
  ): socketio.Server => {
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

    return io;
  };
}
