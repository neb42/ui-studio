import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { Layout } from '../types';
import { FilePaths } from '../FilePaths';

const generateGridLayoutFiles = async (layouts: Layout[]): Promise<void[]> => {
  return Promise.all(
    layouts.map(async (l) => {
      const data = await fs.readFile(path.join(__dirname, 'templates', 'GridLayout.mst'));
      const renderedFile = Mustache.render(data.toString(), {
        name: l.name,
      });
      return fs.writeFile(path.join(FilePaths.components, `${l.name}.js`), renderedFile);
    }),
  );
};

const generateFlexLayoutFiles = async (layouts: Layout[]): Promise<void[]> => {
  return Promise.all(
    layouts.map(async (l) => {
      const data = await fs.readFile(path.join(__dirname, 'templates', 'FlexLayout.mst'));
      const renderedFile = Mustache.render(data.toString(), {
        name: l.name,
      });
      return fs.writeFile(path.join(FilePaths.components, `${l.name}.js`), renderedFile);
    }),
  );
};

const generateLayoutFiles = async (layouts: Layout[]): Promise<void[]> => {
  return Promise.all([
    ...(await generateGridLayoutFiles(layouts.filter((l) => l.layoutType === 'grid'))),
    ...(await generateFlexLayoutFiles(layouts.filter((l) => l.layoutType === 'flex'))),
  ]);
};

export default generateLayoutFiles;
