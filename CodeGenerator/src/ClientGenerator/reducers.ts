import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const generateApiReducerFile = async (foo: string[], type: 'query' | 'serverFunction', basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'ApiReducer.mst'));
  const renderedFile = Mustache.render(data.toString(), { foo, type });
  return fs.writeFile(path.join(basePath, `${type}.js`), renderedFile);
};

const generateWidgetReducerFile = async (widgets: Widget[], basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'WidgetReducer.mst'));
  const renderedFile = Mustache.render(data.toString(), { widgets });
  return fs.writeFile(path.join(basePath, 'widget.js'), renderedFile);
};

const generateRootReducerFile = async (basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'RootReducer.mst'));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(basePath, 'index.js'), renderedFile);
};

const generateReducerFiles = async (
  widgets: Widget[],
  clientFunctions: ClientFunction[],
  basePath: string,
  getChildrenOfTypes: (nodeKey: string, types: string[]) => string[],
): Promise<void[]> => {
  const both = [...widgets, ...clientFunctions];
  const queries = Array.from(new Set(both.flatMap(f => getChildrenOfTypes(f.name, ['query']))));
  const serverFunctions = Array.from(new Set(both.flatMap(f => getChildrenOfTypes(f.name, ['serverFunction']))));

  return Promise.all([
    generateApiReducerFile(queries, 'query', basePath),
    generateApiReducerFile(serverFunctions, 'serverFunction', basePath),
    generateWidgetReducerFile(widgets, basePath),
    generateRootReducerFile(basePath),
  ]);
};

export default generateReducerFiles;