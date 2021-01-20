import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';
import { Widget } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';
import { makeName } from '../helpers';

const generateWidgetFiles = async (widgets: Widget[]): Promise<void[]> => {
  return Promise.all(
    widgets.map(async (w) => {
      const data = await fs.readFile(path.join(__dirname, 'templates', 'Widget.mst'));

      const staticProps = Object.keys(w.props).reduce((acc, cur) => {
        const p = w.props[cur];
        if (p.mode !== 'static') return acc;
        return [...acc, { key: cur, ...p }];
      }, []);

      const variableProps = Object.keys(w.props).reduce((acc, cur) => {
        const p = w.props[cur];
        if (p.mode !== 'variable') return acc;
        return [...acc, { key: cur, ...p }];
      }, []);

      const widgetProps = Object.keys(w.props).reduce((acc, cur) => {
        const p = w.props[cur];
        if (p.mode !== 'widget') return acc;
        return [...acc, { key: cur, ...p }];
      }, []);

      const events = Object.keys(w.events).map((key) => ({ key, ...w.events[key] }));

      // const children = (() => {
      //   if (w?.props?.children?.value) {
      //     if (typeof w.props.children.value === 'string') return `'${w.props.children.value}'`;
      //     return w.props.children.value;
      //   }
      //   return null;
      // })();
      const children = null;

      const renderConfig = {
        name: makeName(w.name, w.id),
        component: w.component,
        staticProps,
        variableProps,
        widgetProps,
        events,
        css: w.style.css,
        exposedProperties: [],
        children,
        library: w.library === 'custom' ? 'functions-pkg' : w.library,
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
      return fs.writeFile(
        path.join(FilePaths.components, makeName(w.name, w.id, true)),
        renderedFile,
      );
    }),
  );
};

export default generateWidgetFiles;
