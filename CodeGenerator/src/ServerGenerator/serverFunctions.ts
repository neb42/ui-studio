import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

import { buildTemplateParams } from '../helpers';

const generateServerFunctionFiles = (serverFunctions: ServerFunction[], basePath: string, getClientDeps: (nodeKey: string) => string[]): Promise<void[]> => {
  return Promise.all(serverFunctions.map(async s => {
    const clientDeps = getClientDeps(s.name);
    const parsedFunctionString = Mustache.render(s.functionString, buildTemplateParams({
      serverFunctions: s.dependencies.serverFunctions,
      queries: s.dependencies.queries,
      clientDeps,
    }));

    const data = await fs.readFile(path.join(__dirname, 'templates', 'serverFunction.mst'));
    const renderedFile = Mustache.render(data.toString(), {
      name: s.name,
      serverFunctions: s.dependencies.serverFunctions,
      queries: s.dependencies.queries,
      clientDependencies: clientDeps,
      functionString: parsedFunctionString,
    });
    return fs.writeFile(path.join(basePath, `${s.name}.js`), renderedFile);
  }));
};

export default generateServerFunctionFiles;