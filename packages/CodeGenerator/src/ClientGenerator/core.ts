import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const coreFiles = [
  { template: 'index.html.mst', fileName: path.join(FilePaths.public, 'index.html') },
  { template: 'Store.mst', fileName: path.join(FilePaths.clientSrc, 'store.js') },
  { template: 'App.mst', fileName: path.join(FilePaths.clientSrc, 'App.js') },
  { template: 'index.mst', fileName: path.join(FilePaths.clientSrc, 'index.js') },
];

const dependencies = [
  { name: 'axios', version: 'latest', last: false },
  { name: 'react', version: 'latest', last: false },
  { name: 'react-dom', version: 'latest', last: false },
  { name: 'react-scripts', version: 'latest', last: false },
  { name: 'redux', version: 'latest', last: false },
  { name: 'react-redux', version: 'latest', last: false },
  { name: 'redux-thunk', version: 'latest', last: false },
  { name: 'react-router', version: 'latest', last: false },
  { name: 'react-router-dom', version: 'latest', last: false },
  { name: 'styled-components', version: 'latest', last: false },
  { name: '@faculty/adler-tokens', version: 'latest', last: false },
  { name: '@faculty/adler-web-components', version: 'latest', last: false },
];
dependencies[dependencies.length - 1].last = true;

const devDependencies = [];
// devDependencies[devDependencies.length - 1 ].last = true;

const generatePackageDotJsonFile = async (): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'package.json.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    devDependencies,
    dependencies,
    buildDirectory: '',
    sourceDirectory: '',
  });
  return fs.writeFile(path.join(FilePaths.client, 'package.json'), renderedFile);
};

const generateParameterlessFile = async (template: string, fileName: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', template));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(fileName, renderedFile);
};

const generateCoreFiles = (): Promise<void[]> => {
  return Promise.all([
    generatePackageDotJsonFile(),
    ...coreFiles.map((f) => generateParameterlessFile(f.template, f.fileName)),
  ]);
};

export default generateCoreFiles;
