import * as path from 'path';

import yargs from 'yargs';
import getPort from 'get-port';

type Options = {
  DEV: boolean;
  PREVIEW_CLIENT_PORT: number;
  PREVIEW_SERVER_PORT: number;
  SERVER_PORT: number;
  GENERATED_CODE_PATH: string;
  REPO_PATH: string;
};

const { argv } = yargs
  .option('path', {
    alias: 'p',
    type: 'string',
    description: 'Path to repo',
  })
  .option('port', {
    alias: 'P',
    type: 'number',
    description: 'Port to run preview server on',
  })
  .option('generated', {
    alias: 'g',
    type: 'string',
    description: 'Path to build generated code at',
  });

let PREVIEW_CLIENT_PORT;
let PREVIEW_SERVER_PORT;
let SERVER_PORT;

export const getOptions = async (): Promise<Options> => {
  if (!PREVIEW_CLIENT_PORT)
    PREVIEW_CLIENT_PORT = await getPort({
      port: argv.port || Number(process.env.PREVIEW_CLIENT_PORT) || 3000,
    });

  if (!PREVIEW_SERVER_PORT)
    PREVIEW_SERVER_PORT = await getPort({
      port: argv.port || Number(process.env.PREVIEW_SERVER_PORT) || 3001,
    });

  if (!SERVER_PORT)
    SERVER_PORT = await getPort({ port: argv.port || Number(process.env.SERVER_PORT) || 3002 });

  const REPO_PATH = argv.path || process.env.REPO_PATH || process.cwd();

  const GENERATED_CODE_PATH = path.join(REPO_PATH, '.ui-studio', 'client');

  return {
    DEV: true,
    PREVIEW_CLIENT_PORT,
    PREVIEW_SERVER_PORT,
    SERVER_PORT,
    GENERATED_CODE_PATH,
    REPO_PATH,
  };
};
