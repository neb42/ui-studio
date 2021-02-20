#!/usr/bin/env node

import { exec, execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

import open from 'open';
import { run as generateCode } from 'canvas-render-engine';

import { getOptions } from './options';

export const initCode = async (): Promise<void> => {
  const {
    GENERATED_CODE_PATH,
    FUNCTIONS_PATH,
    PREVIEW_SERVER_PORT,
    PREVIEW_CLIENT_PORT,
    SERVER_PORT,
  } = await getOptions();

  const clientPath = path.join(GENERATED_CODE_PATH, 'client');
  const serverPath = path.join(GENERATED_CODE_PATH, 'server');

  await generateCode(FUNCTIONS_PATH, true);

  const logError = (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) console.log(`stdout: ${stdout}`);
    if (stderr) console.error(`stderr: ${stderr}`);
  };

  const startPreviewServer = () => {
    console.log(`Starting server at ${FUNCTIONS_PATH}...`);
    exec(
      `nodemon -w ${path.join(
        FUNCTIONS_PATH,
        'build',
      )} -x "env PORT=${PREVIEW_SERVER_PORT} yarn dev"`,
      {
        cwd: serverPath,
      },
    );
  };

  const startPreviewClient = () => {
    console.log(`Starting client as ${clientPath}...`);
    exec(`env BROWSER=none PORT=${PREVIEW_CLIENT_PORT} yarn start`, { cwd: clientPath }, logError);
  };

  const buildFunctions = () => {
    console.log(`Building functions at ${FUNCTIONS_PATH}...`);
    execSync('yarn build', { cwd: FUNCTIONS_PATH, stdio: 'inherit' });
  };

  const installPackages = () => {
    console.log(`Installing client packages as ${clientPath}...`);
    execSync('yarn --force', { cwd: clientPath, stdio: 'inherit' });
    console.log(`Installing server packages at ${serverPath}...`);
    execSync('yarn --force', { cwd: serverPath, stdio: 'inherit' });
  };

  installPackages();
  buildFunctions();
  startPreviewServer();
  startPreviewClient();

  // open(`http://localhost:${SERVER_PORT}`);

  fs.watch(path.join(FUNCTIONS_PATH, 'package.json'), { recursive: true }, () => {
    installPackages();
    buildFunctions();
  });
  fs.watch(path.join(FUNCTIONS_PATH, 'src'), { recursive: true }, buildFunctions);
};
