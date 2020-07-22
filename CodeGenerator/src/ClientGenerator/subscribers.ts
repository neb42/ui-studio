import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

import { getQueryDeps, getServerFunctionDeps } from '../helpers';

const generateSubscriberFiles = async (foo: (Widget | ClientFunction)[], basePath: string): Promise<void[]> => {
  const queries = foo.flatMap(f => getQueryDeps(f.dependencies));
  const serverFunctions = foo.flatMap(f => getServerFunctionDeps(f.dependencies));

  return Promise.all([...queries, ...serverFunctions].map(async f => {
    const data = await fs.readFile(path.join(__dirname, 'templates', 'Subscriber.mst'));
    const renderedFile = Mustache.render(data.toString(), {
      name: f.name,
      type: f.type,
      clientFunctions: f.dependencies.clientFunctions,
      widgets: f.dependencies.widgets,
    });
    return fs.writeFile(path.join(basePath, `${f.name}.js`), renderedFile);
  }));
};

export default generateSubscriberFiles;