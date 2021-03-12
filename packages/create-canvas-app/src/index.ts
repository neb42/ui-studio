import { promises as fs, existsSync } from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

import { copySync } from 'fs-extra';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import * as Mustache from 'mustache';

const getTemplatePackageKeys = (templates: string[]): [string[], string[]] => {
  const allPackages = [];
  const componentPackages = [];
  templates.forEach((t): void => {
    switch (t) {
      case 'faculty': {
        allPackages.push('@faculty/adler-web-components');
        allPackages.push('@faculty/adler-canvas-wrapper');
        componentPackages.push('@faculty/adler-canvas-wrapper');
        break;
      }
      default:
        break;
    }
  });
  return [allPackages, componentPackages];
};

const renderPackageJson = async (name: string, directory: string, templates: string[]) => {
  const [_, templatePackageKeys] = getTemplatePackageKeys(templates);

  const componentPackages = templatePackageKeys.map((t) => ({ name: t, last: false }));
  if (componentPackages.length > 0) componentPackages[componentPackages.length - 1].last = true;

  const data = await fs.readFile(path.join(__dirname, 'template', 'package.json.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    name,
    componentPackages,
  });
  await fs.writeFile(path.join(directory, 'package.json'), renderedFile);
  await fs.unlink(path.join(directory, 'package.json.mst'));
};

const initGit = (directory: string) => {
  execSync('git init', { cwd: directory, stdio: 'inherit' });
  execSync('git add .', { cwd: directory, stdio: 'inherit' });
  execSync("git commit -m 'Initialised from create-canvas-app'", {
    cwd: directory,
    stdio: 'inherit',
  });
};

const addPackages = (directory: string, templates: string[]) => {
  const [templatePackageKeys] = getTemplatePackageKeys(templates);

  const dependencies = ['canvas-typescript', ...templatePackageKeys].map((k) => ({
    name: k,
    version: 'latest',
  }));
  const devDependencies = [
    { name: 'canvas-server', version: 'latest' },
    { name: 'canvas-types', version: 'latest' },
    { name: 'typescript', version: '^4.0.3' },
    { name: '@types/node', version: '^12.0.0' },
    { name: '@types/react', version: '^16.9.53' },
    { name: '@types/react-dom', version: '^16.9.8' },
  ];

  const depsCommand = `yarn add ${dependencies.map((d) => `${d.name}@${d.version}`).join(' ')}`;
  const devDepsCommand = `yarn add -D ${devDependencies
    .map((d) => `${d.name}@${d.version}`)
    .join(' ')}`;

  if (dependencies.length > 0) {
    execSync(depsCommand, { cwd: directory, stdio: 'inherit' });
  }
  if (devDependencies.length > 0) {
    execSync(devDepsCommand, { cwd: directory, stdio: 'inherit' });
  }
};

const run = async (): Promise<void> => {
  const { argv } = yargs(hideBin(process.argv))
    .array('template')
    .alias('template', 't')
    .choices('template', ['faculty'])
    .default('template', [])
    .string('template');
  const name = argv._[0].toString();
  const templates = argv.template;

  if (!name || name.length === 0) throw Error('A directory must be specified');

  const directory = path.join(process.cwd(), name);

  if (existsSync(directory)) throw Error('Directory already exists');

  await fs.mkdir(directory);

  copySync(path.join(__dirname, 'template'), directory);

  await renderPackageJson(name, directory, templates);

  addPackages(directory, templates);
  initGit(directory);
};

run();
