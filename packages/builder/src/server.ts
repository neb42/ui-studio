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

const POLL_TIMEOUT = 1000;

export class Server {
  private server: http.Server;

  private port: number;

  private webSocket: socketio.Socket;

  private clientReady = false;

  private clientPort: number;

  public constructor({ REPO_PATH, SERVER_PORT, PREVIEW_SERVER_PORT, PREVIEW_CLIENT_PORT }: Args) {
    const app = this.createApp();
    this.server = this.createServer(app);
    this.createWebSocket(this.server, REPO_PATH, PREVIEW_SERVER_PORT, PREVIEW_CLIENT_PORT);
    this.port = SERVER_PORT;
    this.clientPort = PREVIEW_CLIENT_PORT;
  }

  public start = (): void => {
    this.server.listen(this.port);
    this.pollClient();
  };

  public reloadComponents = (): void => {
    if (this.webSocket) {
      this.webSocket.emit('reload-components');
    }
  };

  public reloadOpenApiSpec = (): void => {
    if (this.webSocket) {
      this.webSocket.emit('reload-open-api');
    }
  };

  private createApp = (): express.Express => {
    const app = express();

    app.use(cors());

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
      this.webSocket = socket;
      const clientJsonPath = path.join(REPO_PATH, 'client.json');
      const clientJson = JSON.parse(readFileSync(clientJsonPath).toString());

      const packageJsonPath = path.join(REPO_PATH, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
      const { openAPIEndpoint } = packageJson.uiStudio;

      if (this.clientReady) {
        socket.emit('client-ready');
      }

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

  private pollClient = () => {
    let timeout: NodeJS.Timeout | null = null;

    const doPoll = async () => {
      try {
        await axios.get(`http://localhost:${this.clientPort}`);
        this.clientReady = true;
        this.webSocket.emit('client-ready');
      } catch {
        timeout = setTimeout(doPoll, POLL_TIMEOUT);
      }
    };

    doPoll();
  };
}
