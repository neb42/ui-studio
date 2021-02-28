import { promises as fs } from 'fs';
import * as path from 'path';

import { copySync } from 'fs-extra';
import axios from 'axios';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import * as Mustache from 'mustache';

const getPackageVersion = async (key: string) => {
  return {
    name: key,
    version: 'latest',
    last: false,
  };
  const { data } = await axios.get(`https://registry.npmjs.org/${key}`);
  return {
    name: key,
    version: data['dist-tags'].latest,
    last: false,
  };
};

const renderPackageJson = async (name: string, directory: string, templates: string[]) => {
  const templatePackageKeys = (() => {
    const keys = [];
    templates.forEach((t) => {
      switch (t) {
        case 'faculty': {
          keys.push('@faculty/adler-web-components');
          break;
        }
        default:
          break;
      }
    });
    return keys;
  })();

  const dependencies = await Promise.all(
    ['canvas-typescript', ...templatePackageKeys].map(getPackageVersion),
  );
  if (dependencies.length > 0) dependencies[dependencies.length - 1].last = true;

  const devDependencies = await Promise.all(
    ['canvas-server', 'canvas-types'].map(getPackageVersion),
  );
  devDependencies.concat([
    { name: 'typescript', version: '^4.0.3', last: false },
    { name: '@types/node', version: '^12.0.0', last: false },
    { name: '@types/react', version: '^16.9.53', last: false },
    { name: '@types/react-dom', version: '^16.9.8', last: false },
  ]);
  devDependencies[devDependencies.length - 1].last = true;
  if (devDependencies.length > 0) devDependencies[devDependencies.length - 1].last = true;

  const componentPackages = templatePackageKeys.map((t) => ({ name: t, last: false }));
  if (componentPackages.length > 0) componentPackages[componentPackages.length - 1].last = true;

  const data = await fs.readFile(path.join(__dirname, 'template', 'package.json.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    name,
    devDependencies,
    dependencies,
    componentPackages,
  });
  await fs.writeFile(path.join(directory, 'package.json'), renderedFile);
  await fs.unlink(path.join(directory, 'package.json.mst'));
};

const run = async () => {
  const { argv } = yargs(hideBin(process.argv))
    .array('template')
    .alias('template', 't')
    .choices('template', ['faculty'])
    .default('template', [])
    .string('template');
  const name = argv._[0].toString();
  const templates = argv.template;

  const directory = path.join(process.cwd(), name);

  await fs.mkdir(directory);

  copySync(path.join(__dirname, 'template'), directory);

  renderPackageJson(name, directory, templates);
};

run();
