import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const baseDependencies = [
  { name: 'axios', version: '^0.21.1', last: false },
  { name: 'socket.io-client', version: '^2.3.0', last: false },
  { name: 'react', version: '^17.0.1', last: false },
  { name: 'react-dom', version: '^17.0.1', last: false },
  { name: 'react-scripts', version: '4.0.1', last: false },
  { name: 'redux', version: '^4.0.5', last: false },
  { name: 'react-redux', version: '^7.2.2', last: false },
  { name: 'redux-thunk', version: '^2.3.0', last: false },
  { name: 'react-router', version: '^5.2.0', last: false },
  { name: 'react-router-dom', version: '^5.2.0', last: false },
  { name: 'reselect', version: '^4.0.0', last: false },
  { name: 'styled-components', version: '^5.2.1', last: false },
  { name: 'swagger-client', version: '^3.16.1', last: false },
  { name: 'graph-data-structure', version: '^1.13.0', last: false },
  { name: 'web-vitals', version: '^0.2.4', last: false },
];

const devDependencies = [
  { name: 'openapi-types', version: '^9.3.0', last: false },
  { name: 'typescript', version: '^4.0.3', last: false },
  { name: '@types/node', version: '^12.0.0', last: false },
  { name: '@types/react', version: '^16.9.53', last: false },
  { name: '@types/react-dom', version: '^16.9.8', last: false },
  { name: '@types/react-redux', version: '^7.1.16', last: false },
  { name: '@types/react-router', version: '^5.1.11', last: false },
  { name: '@types/react-router-dom', version: '^5.1.7', last: false },
  { name: '@types/redux', version: '^3.6.0', last: false },
  { name: '@types/redux-thunk', version: '^2.1.0', last: false },
  { name: '@types/socket.io-client', version: '^1.4.35', last: false },
  { name: '@types/styled-components', version: '^5.1.4', last: false },
];

const generatePackageFile = async (
  componentPackages: { name: string; version: string }[],
  source: string,
  dev: boolean,
): Promise<void> => {
  const dependencies = [...baseDependencies];
  if (dev) {
    dependencies.push({
      name: 'functions-pkg',
      version: `link:${source}`,
      last: false,
    });
  } else {
    // TODO not sure we need this
    dependencies.push({
      name: 'functions-pkg',
      version: `https://github.com/ui-studio-builder-function-packages/${source}`,
      last: false,
    });
  }

  componentPackages.forEach((p) => {
    dependencies.push({
      name: p.name,
      version: p.version,
      last: false,
    });
  });

  const pkgJson = JSON.parse(
    (await fs.readFile(path.join(__dirname, '../../package.json'))).toString(),
  );
  dependencies.push({
    name: '@ui-studio/typescript',
    version: pkgJson.dependencies['@ui-studio/typescript'],
    last: false,
  });
  devDependencies.push({
    name: '@ui-studio/types',
    version: pkgJson.dependencies['@ui-studio/types'],
    last: false,
  });

  dependencies[dependencies.length - 1].last = true;
  devDependencies[devDependencies.length - 1].last = true;

  const data = await fs.readFile(path.join(__dirname, 'templates', 'package.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    devDependencies,
    dependencies,
    SERVER_PORT: 3001,
  });
  return fs.writeFile(path.join(FilePaths.client, 'package.json'), renderedFile);
};

export default generatePackageFile;
