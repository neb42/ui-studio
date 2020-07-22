import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

import { getQueryDeps, getServerFunctionDeps } from '../helpers';

const generateRouterFile = async (foo: (Widget | ClientFunction)[], basePath: string): Promise<void> => {
  const queries = foo.flatMap(f => getQueryDeps(f.dependencies));
  const serverFunctions = foo.flatMap(f => getServerFunctionDeps(f.dependencies));

  const data = await fs.readFile(path.join(__dirname, 'templates', 'router.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    queries,
    serverFunctions,
    both: [...queries, ...serverFunctions],
  });
  return fs.writeFile(path.join(basePath, 'router.js'), renderedFile);
};

export default generateRouterFile; 