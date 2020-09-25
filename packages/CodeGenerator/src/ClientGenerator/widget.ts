import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';
import { Widget } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';

const componentMap = {
  text: '"span"',
};

const generateWidgetFiles = async (widgets: Widget[]): Promise<void[]> => {
  return Promise.all(
    widgets.map(async (w) => {
      const data = await fs.readFile(path.join(__dirname, 'templates', 'Widget.mst'));

      const props = Object.keys(w.props).reduce((acc, cur) => {
        if (cur === 'children') return acc;
        return [...acc, { key: cur, value: w.props[cur] }];
      }, []);

      const children = (() => {
        if (w.props.children) {
          if (typeof w.props.children === 'string') return `'${w.props.children}'`;
          return w.props.children;
        }
        return null;
      })();

      const renderConfig = {
        name: w.name.replace(' ', '_'),
        component: componentMap[w.component],
        dependencies: Object.values(w.dependencies).flat(),
        exposedProperties: [],
        props,
        children,
        grid: null,
        flex: null,
      };

      if (w.style.type === 'grid') {
        renderConfig.grid = {
          row: {
            start: w.style.layout[0][0],
            end: w.style.layout[1][0] + 1,
          },
          column: {
            start: w.style.layout[0][1],
            end: w.style.layout[1][1] + 1,
          },
        };
      }

      const renderedFile = Mustache.render(data.toString(), renderConfig);
      return fs.writeFile(path.join(FilePaths.components, `${w.name}.js`), renderedFile);
    }),
  );
};

export default generateWidgetFiles;
