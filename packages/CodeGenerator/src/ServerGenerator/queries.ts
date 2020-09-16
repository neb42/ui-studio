import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { buildServerTemplateParams } from '../helpers';
import { Query } from '../types';

const generateQueriesFunctionFiles = (
  queries: Query[],
  basePath: string,
  getClientDeps: (nodeKey: string) => string[],
): Promise<void[]> => {
  return Promise.all(
    queries.map(async (q) => {
      const clientDeps = getClientDeps(q.name);
      const parsedQueryString = Mustache.render(
        q.queryString,
        buildServerTemplateParams({
          serverFunctions: q.dependencies.serverFunctions,
          queries: q.dependencies.queries,
          deps: clientDeps,
          escapeFunctions: true,
        }),
      );
      const data = await fs.readFile(path.join(__dirname, 'templates', 'queryFunction.mst'));
      const renderedFile = Mustache.render(data.toString(), {
        name: q.name,
        dataset: q.dataset,
        serverFunctions: q.dependencies.serverFunctions,
        queries: q.dependencies.queries,
        clientDependencies: clientDeps,
        queryString: parsedQueryString,
      });
      return fs.writeFile(path.join(basePath, `${q.name}.js`), renderedFile);
    }),
  );
};

export default generateQueriesFunctionFiles;
