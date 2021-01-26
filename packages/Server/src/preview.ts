#!/usr/bin/env node

import { readFileSync } from 'fs';
import { exec, execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

import open from 'open';
import { run as generateCode } from '@ui-builder/code-generator';

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
  const severPath = path.join(GENERATED_CODE_PATH, 'server');

  const clientJsonPath = path.join(FUNCTIONS_PATH, 'client.json');
  const clientJson = JSON.parse(readFileSync(clientJsonPath).toString());

  await generateCode(clientJson, FUNCTIONS_PATH, true);

  const logError = (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) console.log(`stdout: ${stdout}`);
    if (stderr) console.error(`stderr: ${stderr}`);
  };

  const startPreviewServer = () => {
    exec(
      `nodemon -w ${path.join(
        FUNCTIONS_PATH,
        'build',
      )} -x "env PORT=${PREVIEW_SERVER_PORT} yarn dev"`,
      {
        cwd: severPath,
      },
    );
  };

  const startPreviewClient = () => {
    exec(`env BROWSER=none PORT=${PREVIEW_CLIENT_PORT} yarn start`, { cwd: clientPath }, logError);
  };

  const buildFunctions = () => {
    execSync('yarn build', { cwd: FUNCTIONS_PATH });
  };

  const installPackages = () => {
    exec('yarn', { cwd: clientPath }, logError);
  };

  installPackages();
  buildFunctions();
  startPreviewServer();
  startPreviewClient();

  open(`http://localhost:${SERVER_PORT}`);

  fs.watch(path.join(FUNCTIONS_PATH, 'package.json'), { recursive: true }, () => {
    installPackages();
    buildFunctions();
  });
  fs.watch(path.join(FUNCTIONS_PATH, 'src'), { recursive: true }, buildFunctions);
};
