import { exec, execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

import open from 'open';
import { run as generateCode } from '@ui-studio/render-engine';

import { getOptions } from './options';

export const initCode = async (): Promise<void> => {
  const {
    GENERATED_CODE_PATH,
    REPO_PATH,
    PREVIEW_SERVER_PORT,
    PREVIEW_CLIENT_PORT,
    SERVER_PORT,
  } = await getOptions();

  const clientPath = path.join(GENERATED_CODE_PATH, 'client');

  await generateCode(REPO_PATH, true);

  const logError = (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) console.log(`stdout: ${stdout}`);
    if (stderr) console.error(`stderr: ${stderr}`);
  };

  const startApi = () => {
    console.log('Initialising api...');
    exec(`yarn api:dev -p ${PREVIEW_SERVER_PORT}`, { cwd: REPO_PATH });
  };

  const startPreviewClient = () => {
    console.log(`Starting client as ${clientPath}...`);
    exec(`env BROWSER=none PORT=${PREVIEW_CLIENT_PORT} yarn start`, { cwd: clientPath }, logError);
  };

  const buildComponents = () => {
    console.log(`Building functions at ${REPO_PATH}...`);
    execSync('yarn build', { cwd: REPO_PATH, stdio: 'inherit' });
  };

  const installClientPackages = () => {
    console.log(`Installing client packages as ${clientPath}...`);
    execSync('yarn --force --prefer-offline', { cwd: clientPath, stdio: 'inherit' });
  };

  startApi();
  installClientPackages();
  buildComponents();
  startPreviewClient();

  open(`http://localhost:${SERVER_PORT}`);

  fs.watch(path.join(REPO_PATH, 'package.json'), { recursive: true }, () => {
    installClientPackages();
    buildComponents();
  });
  fs.watch(path.join(REPO_PATH, 'src'), { recursive: true }, buildComponents);
};
