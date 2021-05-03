import { promises as fs, existsSync, readFileSync } from 'fs';
import * as path from 'path';

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
  FilePaths.init(source);

  await setupDirectory();

  const pkgJson = JSON.parse(readFileSync(path.join(source, 'package.json')).toString());
  const deps = pkgJson.dependencies || {};
  const componentPackages: { name: string; version: string }[] = (
    pkgJson.componentPackages || []
  ).map((p) => {
    if (!Object.keys(deps).includes(p))
      throw Error('Component package is not includes in dependencies');
    return { name: p, version: deps[p] };
  });

  await generateClient({
    componentPackages,
    source,
    dev,
  });

  await generateServer(source, dev);
};

if (typeof require !== 'undefined' && require.main === module) {
  try {
    run('/Users/bmcalindin/workspace/ExampleApp', true);
  } catch (error) {
    console.log(error);
  }
}
