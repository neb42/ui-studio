import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

import { getClientDeps, buildTemplateParams } from './helpers';

const generateQueriesFunctionFiles = (queries: Query[], basePath: string): Promise<void[]> => {
  return Promise.all(queries.map(async q => {
    const parsedQueryString = Mustache.render(q.queryString, buildTemplateParams(q.dependencies));
    const data = await fs.readFile(path.join(__dirname, 'templates', 'queryFunction.mst'));
    const renderedFile = Mustache.render(data.toString(), {
      name: q.name,
      dataset: q.dataset,
      serverFunctions: q.dependencies.serverFunctions,
      queries: q.dependencies.queries,
      clientDependencies: getClientDeps(q.dependencies),
      queryString: parsedQueryString,
    });
    return fs.writeFile(path.join(basePath, `${q.name}.js`), renderedFile);
  }));
};

export default generateQueriesFunctionFiles;