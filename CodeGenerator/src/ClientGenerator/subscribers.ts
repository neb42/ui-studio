import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const generateSubscriberFiles = async (foo: (Widget | ClientFunction)[], basePath: string, getChildrenOfTypes: (nodeKey: string, types: string[]) => string[]): Promise<void[]> => {
  const queries = foo.flatMap(f => getChildrenOfTypes(f.name, ['query']));
  const serverFunctions = foo.flatMap(f => getChildrenOfTypes(f.name, ['serverFunctions']));

  const bar = (set: string[], type: string) => set.map(async s => {
    const clientDeps = getChildrenOfTypes(s, ['clientFunction', 'widget']);
    const data = await fs.readFile(path.join(__dirname, 'templates', 'Subscriber.mst'));
    const renderedFile = Mustache.render(data.toString(), {
      name: s,
      type: type,
      clientDeps,
    });
    return fs.writeFile(path.join(basePath, `${s}.js`), renderedFile);
  });

  return Promise.all([...bar(queries, 'query'), ...bar(serverFunctions, 'serverFunction')]);
};

export default generateSubscriberFiles;