import { promises as fs, existsSync } from 'fs';

import readPkg from 'read-pkg';

import generateServer from './ServerGenerator/generateServer';
import generateClient from './ClientGenerator/generateClient';
import { FilePaths } from './FilePaths';

const mkdir = async (p: string) => {
  if (!existsSync(p)) {
    await fs.mkdir(p);
  }
};

const setupDirectory = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const p of [FilePaths.base, FilePaths.client, FilePaths.server, FilePaths.serverSrc]) {
    await mkdir(p);
  }
};

export const run = async (source: string, dev: boolean): Promise<void> => {
  await setupDirectory();

  const pkgJson = readPkg.sync({ cwd: source });
  const deps = Object.keys(pkgJson.dependencies || {});
  const componentPackages: string[] = pkgJson.componentPackages || [];

  componentPackages.forEach((c) => {
    if (!deps.includes(c)) throw Error('Component package is not includes in dependencies');
  });

  generateClient({
    componentPackages,
    source,
    dev,
  });

  generateServer(componentPackages, source, dev);
};

if (typeof require !== 'undefined' && require.main === module) {
  try {
    run('/Users/bmcalindin/workspace/ui-builder/packages/ExampleApp', true);
  } catch (error) {
    console.log(error);
  }
}
