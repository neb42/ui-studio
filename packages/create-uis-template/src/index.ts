#!/usr/bin/env node

import * as path from 'path';
import { execSync } from 'child_process';

import * as fs from 'fs-extra';
import * as Mustache from 'mustache';
import validateNpmPackageName from 'validate-npm-package-name';

const error = (message: string | string[]) => {
  if (Array.isArray(message)) {
    message.forEach((m) => console.log(m));
  } else {
    console.log(message);
  }
  process.exit(1);
};

const getNpmRunner = (): 'npm' | 'yarn' => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return 'yarn';
  } catch (e) {
    return 'npm';
  }
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

const renderPackageJson = (name: string, directory: string) => {
  const data = fs.readFileSync(path.join(__dirname, 'template', 'package.json.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    name,
  });
  fs.writeFileSync(path.join(directory, 'package.json'), renderedFile);
  fs.unlinkSync(path.join(directory, 'package.json.mst'));
};

const initGit = (directory: string) => {
  execSync('git init', { cwd: directory, stdio: 'inherit' });
  execSync('git add .', { cwd: directory, stdio: 'inherit' });
  execSync("git commit -m 'Initialised from create-uis-template'", {
    cwd: directory,
    stdio: 'inherit',
  });
};

const addPackages = (directory: string, runner: 'npm' | 'yarn') => {
  const dependencies = [{ name: '@ui-studio/typescript', version: 'latest' }];

  const devDependencies = [
    { name: '@ui-studio/builder', version: 'latest' },
    { name: '@ui-studio/types', version: 'latest' },
    { name: 'typescript', version: '^4.0.3' },
    { name: '@types/node', version: '^12.0.0' },
    { name: '@types/react', version: '^16.9.53' },
    { name: '@types/react-dom', version: '^16.9.8' },
    { name: 'openapi-types', version: '^9.3.0' },
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
  const input = process.argv[2];

  checkNodeVersion();

  const runner = getNpmRunner();

  if (!input || input.length === 0) error('A package name must be specified');

  const match = input.match(/^(@[^/]+\/)?([^@]+)?$/);

  const scope = match[1] || '';
  const requestedName = match[2] || '';

  // This shouldn't happen
  if (requestedName.length === 0) error('');

  const name = requestedName.startsWith('uis-template-')
    ? requestedName
    : `uis-template-${requestedName}`;

  const packageName = `${scope}${name}`;

  const { validForNewPackages, warnings, errors } = validateNpmPackageName(packageName);

  if (!validForNewPackages)
    error([`Invalid package name: ${packageName}`, ...(errors || []), ...(warnings || [])]);

  const directory = path.join(process.cwd(), name);

  if (fs.existsSync(directory)) error('Directory already exists');

  fs.mkdirSync(directory);

  fs.copySync(path.join(__dirname, 'template'), directory);

  renderPackageJson(packageName, directory);

  addPackages(directory, runner);

  initGit(directory);
};

run();
