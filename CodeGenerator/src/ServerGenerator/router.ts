import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const generateRouterFile = async (foo: (Widget | ClientFunction)[], basePath: string, getServerFunctionDeps: (nodeKey: string) => string[], getQueryDeps: (nodeKey: string) => string[]): Promise<void> => {
  const queries = Array.from(new Set(foo.flatMap(f => getQueryDeps(f.name))));
  const serverFunctions = Array.from(new Set(foo.flatMap(f => getServerFunctionDeps(f.name))));

  const data = await fs.readFile(path.join(__dirname, 'templates', 'router.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    queries,
    serverFunctions,
    both: [...queries, ...serverFunctions],
  });
  return fs.writeFile(path.join(basePath, 'router.js'), renderedFile);
};

export default generateRouterFile; 