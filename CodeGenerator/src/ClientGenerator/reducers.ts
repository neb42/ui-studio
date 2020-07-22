import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

import { getQueryDeps, getServerFunctionDeps } from '../helpers';

const generateApiReducerFile = async (foo: Query[] | ServerFunction[], type: 'query' | 'serverFunction', basePath: string): Promise<void> => {
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

const generateReducerFiles = async (widgets: Widget[], clientFunctions: ClientFunction[], basePath: string): Promise<void[]> => {
  const both = [...widgets, ...clientFunctions];
  const queries = both.flatMap(f => getQueryDeps(f.dependencies));
  const serverFunctions = both.flatMap(f => getServerFunctionDeps(f.dependencies));

  return Promise.all([
    generateApiReducerFile(queries, 'query', basePath),
    generateApiReducerFile(serverFunctions, 'serverFunction', basePath),
    generateWidgetReducerFile(widgets, basePath),
    generateRootReducerFile(basePath),
  ]);
};

export default generateReducerFiles;