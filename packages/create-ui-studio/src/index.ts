#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

import { copySync } from 'fs-extra';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import * as Mustache from 'mustache';

const error = (message: string) => {
  console.log(message);
  process.exit(1);
};

const getNpmRunner = (): 'npm' | 'yarn' => {
  const runner = process.argv[0];
  if (!['npm', 'yarn'].includes(runner)) error('Invalid runner');
  return runner as 'npm' | 'yarn';
};

const checkNodeVersion = () => {
  const currentNodeVersion = process.versions.node;
  const semver = currentNodeVersion.split('.');
  const major = Number(semver[0]);

  if (typeof major !== 'number' || Number.isNaN(major) || major < 14) {
    error(
      `You are running Node ${currentNodeVersion}.\n` +
        'Create UI Studio requires Node 14 or higher. \n' +
        'Please update your version of Node.',
    );
  }
};

const getTemplatePackageKeys = (templates: string[]): [string[], string[]] => {
  const allPackages = [];
  const componentPackages = [];
  templates.forEach((t): void => {
    switch (t) {
      case 'faculty': {
        allPackages.push('@faculty/adler-web-components');
        allPackages.push('@faculty/adler-ui-studio-wrapper');
        componentPackages.push('@faculty/adler-ui-studio-wrapper');
        break;
      }
      default:
        break;
    }
  });
  return [allPackages, componentPackages];
};

const renderPackageJson = (name: string, directory: string, templates: string[]) => {
  const [_, templatePackageKeys] = getTemplatePackageKeys(templates);

  const componentPackages = templatePackageKeys.map((t) => ({ name: t, last: false }));
  if (componentPackages.length > 0) componentPackages[componentPackages.length - 1].last = true;

  const data = fs.readFileSync(path.join(__dirname, 'template', 'package.json.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    name,
    componentPackages,
  });
  fs.writeFileSync(path.join(directory, 'package.json'), renderedFile);
  fs.unlinkSync(path.join(directory, 'package.json.mst'));
};

const initGit = (directory: string) => {
  execSync('git init', { cwd: directory, stdio: 'inherit' });
  execSync('git add .', { cwd: directory, stdio: 'inherit' });
  execSync("git commit -m 'Initialised from create-ui-studio'", {
    cwd: directory,
    stdio: 'inherit',
  });
};

const addPackages = (directory: string, templates: string[], runner: 'npm' | 'yarn') => {
  const [templatePackageKeys] = getTemplatePackageKeys(templates);

  const dependencies = ['@ui-studio/typescript', ...templatePackageKeys].map((k) => ({
    name: k,
    version: 'latest',
  }));
  const devDependencies = [
    { name: '@ui-studio/builder', version: 'latest' },
    { name: '@ui-studio/types', version: 'latest' },
    { name: '@ui-studio/typescript', version: 'latest' },
    { name: 'typescript', version: '^4.0.3' },
    { name: '@types/node', version: '^12.0.0' },
    { name: '@types/react', version: '^16.9.53' },
    { name: '@types/react-dom', version: '^16.9.8' },
  ];

  const add = runner === 'yarn' ? 'yarn add' : 'npm install';
  const depsCommand = `${add} ${dependencies.map((d) => `${d.name}@${d.version}`).join(' ')}`;
  const devDepsCommand = `${add} -D ${devDependencies
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

  checkNodeVersion();

  const runner = getNpmRunner();

  if (!name || name.length === 0) error('A directory must be specified');

  const directory = path.join(process.cwd(), name);

  if (fs.existsSync(directory)) error('Directory already exists');

  fs.mkdirSync(directory);

  copySync(path.join(__dirname, 'template'), directory);

  renderPackageJson(name, directory, templates);

  addPackages(directory, templates, runner);
  initGit(directory);
};

run();
