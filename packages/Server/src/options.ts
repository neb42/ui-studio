import yargs from 'yargs';
import getPort from 'get-port';

const { argv } = yargs
  .option('path', {
    alias: 'p',
    type: 'string',
    description: 'Path to functions package',
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
export const getOptions = async () => {
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
  const GENERATED_CODE_PATH = argv.generated || process.env.GENERATED_PATH || '/tmp/GeneratedCode';
  const FUNCTIONS_PATH = argv.path || process.env.FUNCTIONS_PATH || process.cwd();

  return {
    PREVIEW_CLIENT_PORT,
    PREVIEW_SERVER_PORT,
    SERVER_PORT,
    GENERATED_CODE_PATH,
    FUNCTIONS_PATH,
  };
};
