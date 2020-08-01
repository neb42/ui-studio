import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const dependencies = [
  { name: 'cors', version: 'latest', last: false },
  { name: 'cookie-parser', version: 'latest', last: false },
  { name: 'express', version: 'latest', last: false },
  { name: 'mysql', version: 'latest', last: false },
  { name: 'body-parser', version: 'latest', last: false },
];
dependencies[dependencies.length - 1 ].last = true;

const devDependencies = [
  { name: '@babel/core', version: 'latest', last: false },
  { name: '@babel/cli', version: 'latest', last: false },
  { name: '@babel/node', version: 'latest', last: false },
  { name: '@babel/preset-env', version: 'latest', last: false },
];
devDependencies[devDependencies.length - 1 ].last = true;

const generatePackageDotJsonFile = async (appName: string, basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'package.json.mst'));
  const renderedFile = Mustache.render(data.toString(), { appName, devDependencies, dependencies, buildDirectory: 'build', sourceDirectory: 'src' });
  return fs.writeFile(path.join(basePath, 'package.json'), renderedFile);
};

const generateBabelConfigFile = async (basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'babelConfig.mst'));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(basePath, 'babel.config.js'), renderedFile);
};

const generateCoreFiles = (appName: string, basePath: string): Promise<void[]> => {
  return Promise.all([
    generatePackageDotJsonFile(appName, basePath),
    generateBabelConfigFile(basePath),
  ]);
};

export default generateCoreFiles; 