import { promises as fs } from 'fs';
import * as path from 'path';

import generateServerFunctionFiles from './serverFunctions';
import generateDatasetsFile from './dataset';
import generateQueriesFunctionFiles from './queries';
import generateRouterFile from './router';

interface Args {
  datasets: Dataset[];
  queries: Query[];
  serverFunctions: ServerFunction[];
  clientFunctions: ClientFunction[];
  components: Component[];
}

const basePath = '/tmp/server';
const queriesPath = path.join(basePath, 'Queries');
const serverFunctionsPath = path.join(basePath, 'ServerFunctions');

const generateServer = async ({
  datasets,
  queries,
  serverFunctions,
  clientFunctions,
  components,
}: Args) => {
  await Promise.all([
    fs.mkdir(basePath),
    fs.mkdir(queriesPath),
    fs.mkdir(serverFunctionsPath),
  ]);

  generateDatasetsFile(datasets, basePath);
  generateQueriesFunctionFiles(queries, queriesPath);
  generateServerFunctionFiles(serverFunctions, serverFunctionsPath);
  generateRouterFile([... clientFunctions, ...components], basePath);
};

export default generateServer;