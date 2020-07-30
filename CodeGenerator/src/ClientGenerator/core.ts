import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const coreFiles = [
  { template: 'index.mst', fileName: path.join('src', 'index.js') },
  { template: 'index.html.mst', fileName: path.join('public', 'index.html') },
  { template: 'Store.mst', fileName: path.join('src', 'store.js') },
];

const dependencies = [
  { name: 'axios', version: 'latest', last: false },
  { name: 'react', version: 'latest', last: false },
  { name: 'react-dom', version: 'latest', last: false },
  { name: 'react-scripts', version: 'latest', last: false },
  { name: 'redux', version: 'latest', last: false },
  { name: 'react-redux', version: 'latest', last: false },
  { name: 'redux-thunk', version: 'latest', last: false },
  { name: 'styled-components', version: 'latest', last: false },
  { name: '@faculty/adler-tokens', version: 'latest', last: false },
  { name: '@faculty/adler-web-components', version: 'latest', last: false },
];
dependencies[dependencies.length - 1 ].last = true;

const devDependencies = [
];
// devDependencies[devDependencies.length - 1 ].last = true;

const generatePackageDotJsonFile = async (appName: string, basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'package.json.mst'));
  const renderedFile = Mustache.render(data.toString(), { appName, devDependencies, dependencies, buildDirectory: '', sourceDirectory: '' });
  return fs.writeFile(path.join(basePath, 'package.json'), renderedFile);
};

const generateParameterlessFile = async (template: string, fileName: string, basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', template));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(basePath, fileName), renderedFile);
};

const generateCoreFiles = (appName: string, basePath: string): Promise<void[]> => {
  return Promise.all([
    generatePackageDotJsonFile(appName, basePath),
    ...coreFiles.map(f => generateParameterlessFile(f.template, f.fileName, basePath)),
  ]);
};

export default generateCoreFiles; 