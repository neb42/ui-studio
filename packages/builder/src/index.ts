#!/usr/bin/env node

import { run as generateCode } from '@ui-studio/render-engine';

import { getOptions } from './options';
import { Screen } from './screen';
import { Server } from './server';
import { ApiRunner } from './apiRunner';
import { ClientRunner } from './clientRunner';
import { ComponentsRunner } from './componentsRunner';
import { Watcher } from './watcher';

const run = async (): Promise<void> => {
  const {
    DEV,
    SERVER_PORT,
    REPO_PATH,
    GENERATED_CODE_PATH,
    PREVIEW_CLIENT_PORT,
    PREVIEW_SERVER_PORT,
  } = await getOptions();

  const screen = new Screen();

  const server = new Server({
    REPO_PATH,
    SERVER_PORT,
    PREVIEW_SERVER_PORT,
    PREVIEW_CLIENT_PORT,
  });

  const apiRunner = new ApiRunner({
    logger: screen.bottomLeft,
    path: REPO_PATH,
    port: PREVIEW_SERVER_PORT,
  });

  const clientRunner = new ClientRunner({
    logger: screen.bottomRight,
    path: GENERATED_CODE_PATH,
    port: PREVIEW_CLIENT_PORT,
    clientUrl: `http://localhost:${SERVER_PORT}`,
  });

  const componentsRunner = new ComponentsRunner({
    logger: screen.topRight,
    path: REPO_PATH,
  });

  const watcher = new Watcher({
    path: REPO_PATH,
    clientRunner,
    componentsRunner,
    server,
  });

  screen.screen.key(['escape', 'q', 'C-c'], () => {
    watcher.stop();
    apiRunner.stop();
    clientRunner.stop();
    componentsRunner.stop();
    return process.exit(0);
  });

  await generateCode(REPO_PATH, DEV);

  await componentsRunner.run();

  server.start();

  apiRunner.start();
  clientRunner.start();

  watcher.watch();
};

if (typeof require !== 'undefined' && require.main === module) {
  run();
}
