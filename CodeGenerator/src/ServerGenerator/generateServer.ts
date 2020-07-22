import { promises as fs, existsSync } from 'fs';
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
  widgets: Widget[];
  getChildrenOfTypes: (nodeKey: string, types: string[]) => string[];
  basePath: string,
}


const generateServer = async ({
  datasets,
  queries,
  serverFunctions,
  clientFunctions,
  widgets,
  getChildrenOfTypes,
  basePath,
}: Args) => {
  const serverPath = path.join(basePath, 'server');
  const queriesPath = path.join(serverPath, 'queries');
  const serverFunctionsPath = path.join(serverPath, 'serverFunctions');

  if (!existsSync(serverPath)){
    await fs.mkdir(serverPath);
  }
  if (!existsSync(queriesPath)){
    await fs.mkdir(queriesPath);
  }
  if (!existsSync(serverFunctionsPath)){
    await fs.mkdir(serverFunctionsPath);
  }

  const getClientDeps = key => getChildrenOfTypes(key, ['widget', 'clientFunction']);
  const getServerFunctionDeps = key => getChildrenOfTypes(key, ['serverFunction']);
  const getQueryDeps = key => getChildrenOfTypes(key, ['query']);

  generateDatasetsFile(datasets, serverPath);
  generateQueriesFunctionFiles(queries, queriesPath, getClientDeps);
  generateServerFunctionFiles(serverFunctions, serverFunctionsPath, getClientDeps);
  generateRouterFile([... clientFunctions, ...widgets], serverPath, getServerFunctionDeps, getQueryDeps);
};

export default generateServer;