import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const generateComponentTypesFile = async (
  componentPackages: { name: string; version: string }[],
): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'componentTypes.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    componentPackages,
  });
  return fs.writeFile(path.join(FilePaths.clientSrc, 'component-packages.d.ts'), renderedFile);
};

export default generateComponentTypesFile;
