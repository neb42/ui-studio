#!/usr/bin/env node

import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

import { run as generateCode } from '@ui-builder/code-generator';

import { GENERATED_CODE_PATH, FUNCTIONS_PATH } from './options';

const clientPath = path.join(GENERATED_CODE_PATH, 'client');
const severPath = path.join(GENERATED_CODE_PATH, 'server');

export const initCode = async () => {
  await generateCode(null, FUNCTIONS_PATH, true);

  const logError = (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  };

  let devServer;
  exec('yarn', { cwd: severPath }, logError).on('exit', (code) => {
    devServer = exec(
      `nodemon -w ${path.join(FUNCTIONS_PATH, 'build')} -x "yarn dev"`,
      { cwd: severPath },
      logError,
    );
  });

  let devClient;
  exec('yarn', { cwd: clientPath }, logError).on('exit', (code) => {
    devClient = exec('env BROWSER=none yarn start', { cwd: clientPath }, logError);
  });

  fs.watch(path.join(FUNCTIONS_PATH, 'src'), { recursive: true }, () => {
    console.info('Building functions');
    exec('yarn build', { cwd: FUNCTIONS_PATH }, logError);
  });
};
