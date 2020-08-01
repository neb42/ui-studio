import { promises as fs, existsSync } from 'fs';
import * as path from 'path';

import generateServerFunctionFiles from './serverFunctions';
import generateDatasetsFile from './dataset';
import generateQueriesFunctionFiles from './queries';
import generateRouterFile from './router';
import generateCoreFiles from './core';

interface Args {
  appName: string,
  datasets: Dataset[];
  queries: Query[];
  serverFunctions: ServerFunction[];
  clientFunctions: ClientFunction[];
  widgets: Widget[];
  getChildrenOfTypes: (nodeKey: string, types: string[]) => string[];
  basePath: string;
}


const generateServer = async ({
  appName,
  datasets,
  queries,
  serverFunctions,
  clientFunctions,
  widgets,
  getChildrenOfTypes,
  basePath,
}: Args): Promise<[void[], void, void[], void[], void]> => {
  const serverPath = path.join(basePath, 'server');
  const srcPath = path.join(serverPath, 'src');
  const queriesPath = path.join(srcPath, 'queries');
  const serverFunctionsPath = path.join(srcPath, 'serverFunctions');

  if (!existsSync(serverPath)){
    await fs.mkdir(serverPath);
  }
  if (!existsSync(srcPath)){
    await fs.mkdir(srcPath);
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

  return Promise.all([
    generateCoreFiles(appName, serverPath),
    generateDatasetsFile(datasets, srcPath),
    generateQueriesFunctionFiles(queries, queriesPath, getClientDeps),
    generateServerFunctionFiles(serverFunctions, serverFunctionsPath, getClientDeps),
    generateRouterFile([... clientFunctions, ...widgets], srcPath, getServerFunctionDeps, getQueryDeps),
  ]);
};

export default generateServer;