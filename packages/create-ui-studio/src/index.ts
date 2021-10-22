#!/usr/bin/env node

import * as path from 'path';
import { execSync } from 'child_process';

import * as fs from 'fs-extra';
import { copySync } from 'fs-extra';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import * as Mustache from 'mustache';

import { mergeTemplate } from './template';

const error = (message: string) => {
  console.log(message);
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
  execSync("git commit -m 'Initialised from create-ui-studio'", {
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

const createComponentsIndex = (rootDir: string) => {
  const componentsRoot = path.join(rootDir, 'src', 'Components');
  fs.ensureDirSync(componentsRoot);
  const components = fs
    .readdirSync(componentsRoot)
    .filter((f) => f !== 'index.ts.mst')
    .map((f) => f.replace(/\.tsx?/, ''));
  const data = fs.readFileSync(path.join(componentsRoot, 'index.ts.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    components,
  });
  fs.writeFileSync(path.join(componentsRoot, 'index.ts'), renderedFile);
  fs.unlinkSync(path.join(componentsRoot, 'index.ts.mst'));
};

const createEntryPointIndex = (rootDir: string) => {
  const entryPointRoot = path.join(rootDir, 'src', 'App');
  const entryPoints = fs
    .readdirSync(entryPointRoot)
    .filter((f) => f !== 'index.tsx.mst')
    .map((f) => f.replace(/\.tsx?/, ''));
  const data = fs.readFileSync(path.join(entryPointRoot, 'index.tsx.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    noEntryPoints: entryPoints.length === 0,
    entryPoints,
    reverseEntryPoints: entryPoints.slice().reverse(),
  });
  fs.writeFileSync(path.join(entryPointRoot, 'index.tsx'), renderedFile);
  fs.unlinkSync(path.join(entryPointRoot, 'index.tsx.mst'));
};

const run = async (): Promise<void> => {
  const { argv } = yargs(hideBin(process.argv))
    .array('template')
    .alias('template', 't')
    .default('template', [])
    .string('template');

  const rawDirectory = argv._[0].toString();
  const templates = argv.template;

  checkNodeVersion();

  const runner = getNpmRunner();

  if (!rawDirectory || rawDirectory.length === 0) error('A directory must be specified');

  const directory = rawDirectory.startsWith('/')
    ? rawDirectory
    : path.join(process.cwd(), rawDirectory);
  const name = directory.split('/').slice(-1)[0];

  if (fs.existsSync(directory)) error('Directory already exists');
  if (!fs.existsSync(directory.split('/').slice(0, -1).join('/')))
    error('Parent directory does not exist');

  fs.mkdirSync(directory);

  copySync(path.join(__dirname, 'template'), directory);

  renderPackageJson(name, directory);

  addPackages(directory, runner);

  await Promise.all(templates.map((t) => mergeTemplate(t, directory)));

  createComponentsIndex(directory);

  createEntryPointIndex(directory);

  initGit(directory);
};

run();
