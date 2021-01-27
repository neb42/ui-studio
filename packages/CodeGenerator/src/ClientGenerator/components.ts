import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const generateComponentsFile = async (componentPackages: string[]): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'components.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    components: componentPackages.map((c) => ({
      package: c,
      name: c.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase(),
    })),
  });
  return fs.writeFile(path.join(FilePaths.clientSrc, 'Components.ts'), renderedFile);
};

export default generateComponentsFile;
