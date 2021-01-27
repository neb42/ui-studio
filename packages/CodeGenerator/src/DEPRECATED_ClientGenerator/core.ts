import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const coreFiles = [
  { template: 'index.html.mst', fileName: path.join(FilePaths.public, 'index.html'), dev: false },
  { template: 'Store.mst', fileName: path.join(FilePaths.clientSrc, 'store.js'), dev: false },
  { template: 'App.mst', fileName: path.join(FilePaths.clientSrc, 'App.js'), dev: false },
  { template: 'index.mst', fileName: path.join(FilePaths.clientSrc, 'index.js'), dev: false },
  {
    template: 'DevCommunicator.mst',
    fileName: path.join(FilePaths.clientSrc, 'DevCommunicator.js'),
    dev: true,
  },
];

const baseDependencies = [
  { name: 'axios', version: 'latest', last: false },
  { name: 'socket.io-client', version: '^2.3.0', last: false },
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

const devDependencies = [];
// devDependencies[devDependencies.length - 1 ].last = true;

const generatePackageDotJsonFile = async (source: string, dev: boolean): Promise<void> => {
  const dependencies = [...baseDependencies];
  if (dev) {
    dependencies.push({
      name: 'functions-pkg',
      version: `link:${source}`,
      last: true,
    });
  } else {
    dependencies.push({
      name: 'functions-pkg',
      version: `https://github.com/ui-builder-function-packages/${source}`,
      last: true,
    });
  }

  const data = await fs.readFile(path.join(__dirname, 'templates', 'package.json.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    devDependencies,
    dependencies,
    buildDirectory: '',
    sourceDirectory: '',
  });
  return fs.writeFile(path.join(FilePaths.client, 'package.json'), renderedFile);
};

const generateParameterlessFile = async (
  template: string,
  fileName: string,
  dev: boolean,
): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', template));
  const renderedFile = Mustache.render(data.toString(), { dev });
  return fs.writeFile(fileName, renderedFile);
};

const generateCoreFiles = (source: string, dev: boolean): Promise<void[]> => {
  return Promise.all([
    generatePackageDotJsonFile(source, dev),
    ...coreFiles
      .filter((f) => !f.dev || dev)
      .map((f) => generateParameterlessFile(f.template, f.fileName, dev)),
  ]);
};

export default generateCoreFiles;
