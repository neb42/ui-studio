import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const baseDependencies = [
  { name: 'axios', version: 'latest', last: false },
  { name: 'body-parser', version: 'latest', last: false },
  { name: 'cors', version: 'latest', last: false },
  { name: 'cookie-parser', version: 'latest', last: false },
  { name: 'express', version: 'latest', last: false },
  // Bit shit we need to install these server side
  { name: 'react', version: '^17.0.1', last: false },
  { name: 'react-dom', version: '^17.0.1', last: false },
  { name: 'styled-components', version: '^5.2.1', last: false },
];

const devDependencies = [
  { name: '@babel/core', version: 'latest', last: false },
  { name: '@babel/cli', version: 'latest', last: false },
  { name: '@babel/node', version: 'latest', last: false },
  { name: '@babel/preset-env', version: 'latest', last: false },
];
devDependencies[devDependencies.length - 1].last = true;

const generatePackageJsonFile = async (source: string, dev: boolean): Promise<void> => {
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
    buildDirectory: 'build',
    sourceDirectory: 'src',
  });
  return fs.writeFile(path.join(FilePaths.server, 'package.json'), renderedFile);
};

export default generatePackageJsonFile;
