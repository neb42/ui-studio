import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { Widget } from '../types';
import { FilePaths } from '../FilePaths';

const generateFunctionsReducerFile = async (): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'FunctionsReducer.mst'));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(FilePaths.reducers, 'functions.js'), renderedFile);
};

const generateWidgetReducerFile = async (widgets: Widget[]): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'WidgetReducer.mst'));
  const renderedFile = Mustache.render(data.toString(), { widgets });
  return fs.writeFile(path.join(FilePaths.reducers, 'widget.js'), renderedFile);
};

const generateRootReducerFile = async (): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'RootReducer.mst'));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(FilePaths.reducers, 'index.js'), renderedFile);
};

const generateReducerFiles = async (widgets: Widget[]): Promise<void[]> => {
  return Promise.all([
    generateWidgetReducerFile(widgets),
    generateFunctionsReducerFile(),
    generateRootReducerFile(),
  ]);
};

export default generateReducerFiles;
