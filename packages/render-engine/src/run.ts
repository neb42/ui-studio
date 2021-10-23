import { promises as fs, existsSync } from 'fs';

import generateClient from './ClientGenerator/generateClient';
import { parseConfig } from './ClientGenerator/parseConfig';
import { FilePaths } from './FilePaths';

const mkdir = async (p: string) => {
  if (!existsSync(p)) {
    await fs.mkdir(p);
  }
};

const setupDirectory = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const p of [FilePaths.base, FilePaths.client]) {
    await mkdir(p);
  }
};

export const run = async (source: string, dev: boolean): Promise<void> => {
  FilePaths.init(source);

  await setupDirectory();

  const config = await parseConfig(source);

  await generateClient({
    config,
    source,
  });
};

if (typeof require !== 'undefined' && require.main === module) {
  try {
    run(process.argv[2], true);
  } catch (error) {
    console.log(error);
  }
}
