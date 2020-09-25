import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';
import { Layout } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';

const generateGridLayoutFiles = async (layouts: Layout[]): Promise<void[]> => {
  return Promise.all(
    layouts.map(async (l) => {
      const data = await fs.readFile(path.join(__dirname, 'templates', 'GridLayout.mst'));

      const renderConfig = {
        name: l.name.replace(' ', '_'),
        columns: l.props.columns,
        rows: l.props.rows,
        grid: null,
        flex: null,
      };

      if (l.style.type === 'grid') {
        renderConfig.grid = {
          row: {
            start: l.style.layout[0][0],
            end: l.style.layout[1][0],
          },
          column: {
            start: l.style.layout[0][1],
            end: l.style.layout[1][1],
          },
        };
      }

      const renderedFile = Mustache.render(data.toString(), renderConfig);
      return fs.writeFile(path.join(FilePaths.components, `${l.name}.js`), renderedFile);
    }),
  );
};

const generateFlexLayoutFiles = async (layouts: Layout[]): Promise<void[]> => {
  return Promise.all(
    layouts.map(async (l) => {
      const data = await fs.readFile(path.join(__dirname, 'templates', 'FlexLayout.mst'));

      const renderConfig = {
        name: l.name.replace(' ', '_'),
        columns: l.props.columns,
        rows: l.props.rows,
        grid: null,
        flex: null,
      };

      if (l.style.type === 'grid') {
        renderConfig.grid = {
          row: {
            start: l.style.layout[0][0],
            end: l.style.layout[1][0] + 1,
          },
          column: {
            start: l.style.layout[0][1],
            end: l.style.layout[1][1] + 1,
          },
        };
      }

      const renderedFile = Mustache.render(data.toString(), renderConfig);
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
