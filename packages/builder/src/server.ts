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
  PREVIEW_CLIENT_PORT: number;
};

const POLL_TIMEOUT = 1000;

const rooms = {
  client: 'CLIENT',
  builder: 'BUILDER',
};

const messages = {
  builder: {
    registerBuilder: 'REGISTER-BUILDER',
    initClient: 'BUILDER: INIT-CLIENT',
    clientReady: 'BUILDER: CLIENT-READY',
    setServer: 'BUILDER: SET-SERVER',
    initBuilder: 'BUILDER: INIT-BUILDER',
    initApi: 'BUILDER: INIT-API',
    navigatePage: 'BUILDER: NAVIGATE-PAGE',
  },
  client: {
    registerClient: 'REGISTER-CLIENT',
    initClient: 'CLIENT: INIT-CLIENT',
    updateTree: 'CLIENT: UPDATE-TREE',
    setOpenApiEndpoint: 'CLIENT: SET-OPEN-API-ENDPOINT',
    reloadOpenApi: 'CLIENT: RELOAD-OPEN-API',
    reloadComponents: 'CLIENT: RELOAD-COMPONENTS',
    navigatePage: 'CLIENT: NAVIGATE-PAGE',
    selectElement: 'CLIENT: SELECT-ELEMENT',
    hoverElement: 'CLIENT: HOVER-ELEMENT',
  },
};

export class Server {
  private server: http.Server;

  private port: number;

  private io: socketio.Server;

  private clientReady = false;

  private clientPort: number;

  private clientUrl = '/';

  private pollTimeout: NodeJS.Timeout | null;

  public constructor({ REPO_PATH, SERVER_PORT, PREVIEW_CLIENT_PORT }: Args) {
    this.port = SERVER_PORT;
    this.clientPort = PREVIEW_CLIENT_PORT;

    const app = this.createApp();
    this.server = this.createServer(app);
    this.io = this.createWebSocket(this.server, REPO_PATH);
  }

  public start = (): void => {
    this.server.listen(this.port);
    this.pollClient();
  };

  public stop = (): void => {
    this.server.close();
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }
  };

  public reloadComponents = (): void => {
    if (this.io) {
      this.io.to(rooms.client).emit(messages.client.reloadComponents);
    }
  };

  public reloadOpenApiSpec = (): void => {
    if (this.io) {
      this.io.to(rooms.client).emit(messages.client.reloadOpenApi);
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

  private createWebSocket = (server: http.Server, REPO_PATH: string): socketio.Server => {
    const io = socketio(server);
    io.origins('*:*');

    io.on('connection', (socket) => {
      const clientJsonPath = path.join(REPO_PATH, 'client.json');
      const clientJson = JSON.parse(readFileSync(clientJsonPath).toString());

      const packageJsonPath = path.join(REPO_PATH, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
      const { openAPIEndpoint } = packageJson.uiStudio;

      socket.on(messages.builder.registerBuilder, () => {
        this.registerBuilder(io, socket, clientJson, clientJsonPath);
      });

      socket.on(messages.client.registerClient, () => {
        this.registerClient(io, socket, clientJson, openAPIEndpoint);
      });
    });

    return io;
  };

  private registerBuilder = (
    io: socketio.Server,
    socket: socketio.Socket,
    clientJson: any,
    clientJsonPath: string,
  ): void => {
    socket.join(rooms.builder, () => {
      if (this.clientReady) {
        io.to(socket.id).emit(messages.builder.clientReady);
      }

      io.to(socket.id).emit(messages.builder.initClient, clientJson);

      io.to(socket.id).emit(messages.builder.setServer, {
        host: 'http://localhost',
        clientPort: this.clientPort,
      });

      socket.on(messages.client.updateTree, (elements) => {
        socket.to(rooms.client).emit(messages.client.updateTree, elements);
        writeFileSync(
          clientJsonPath,
          JSON.stringify({ version: clientJson.version, ...elements }, null, 4),
        );
      });

      socket.on(messages.client.navigatePage, (r) => {
        socket.to(rooms.client).emit(messages.client.navigatePage, r);
      });

      socket.on(messages.client.hoverElement, (r) => {
        socket.to(rooms.client).emit(messages.client.hoverElement, r);
      });

      socket.on(messages.client.selectElement, (r) => {
        socket.to(rooms.client).emit(messages.client.selectElement, r);
      });
    });
  };

  private registerClient = (
    io: socketio.Server,
    socket: socketio.Socket,
    clientJson: string,
    openAPIEndpoint: string,
  ): void => {
    socket.join(rooms.client, () => {
      io.to(socket.id).emit(messages.client.initClient, clientJson);
      io.to(socket.id).emit(messages.client.setOpenApiEndpoint, openAPIEndpoint);

      socket.on(messages.builder.navigatePage, (r) => {
        socket.to(rooms.builder).emit(messages.builder.navigatePage, r);
      });

      socket.on(messages.builder.initApi, (r) => {
        socket.to(rooms.builder).emit(messages.builder.initApi, r);
      });

      socket.on(messages.builder.initBuilder, (r) => {
        socket.to(rooms.builder).emit(messages.builder.initBuilder, r);
      });
    });
  };

  private pollClient = () => {
    const doPoll = async () => {
      try {
        await axios.get(`http://localhost:${this.clientPort}`);
        this.clientReady = true;
        this.io.to(rooms.builder).emit(messages.builder.clientReady);
        clearTimeout(this.pollTimeout);
        this.pollTimeout = null;
      } catch {
        this.pollTimeout = setTimeout(doPoll, POLL_TIMEOUT);
      }
    };

    doPoll();
  };
}
