import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const dependencies = [
  { name: 'cors', version: 'x.x.x', last: false },
  { name: 'cookie-parser', version: 'x.x.x', last: false },
  { name: 'express', version: 'x.x.x', last: false },
];
dependencies[dependencies.length - 1 ].last = true;

const devDependencies = [
  { name: '@faculty/babel-preset', version: 'x.x.x', last: false },
];
devDependencies[devDependencies.length - 1 ].last = true;

const generatePackageDotJsonFile = async (appName: string, basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'package.json.mst'));
  const renderedFile = Mustache.render(data.toString(), { appName, devDependencies, dependencies, buildDirectory: '', sourceDirectory: '' });
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