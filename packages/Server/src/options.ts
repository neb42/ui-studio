import yargs from 'yargs';

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

export const PORT = argv.port || process.env.PORT || 3002;
export const FUNCTIONS_PATH = argv.path || process.env.FUNCTIONS_PATH || '';
export const GENERATED_CODE_PATH =
  argv.generated || process.env.GENERATED_PATH || '/tmp/GeneratedCode';
if (FUNCTIONS_PATH === '') throw Error('No functions path specified');
