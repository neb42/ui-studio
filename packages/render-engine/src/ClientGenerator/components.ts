import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const generateComponentsFile = async (
  componentPackages: { name: string; version: string }[],
): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'components.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    components: componentPackages.map(({ name }) => ({
      package: name,
      name: name
        .split('/')
        .slice(-1)[0]
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
          new RegExp(/\s+(.)(\w+)/, 'g'),
          ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`,
        )
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), (s) => s.toUpperCase()),
    })),
  });
  return fs.writeFile(path.join(FilePaths.clientSrc, 'Components.ts'), renderedFile);
};

export default generateComponentsFile;
