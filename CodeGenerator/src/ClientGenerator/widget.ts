import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const generateWidgetFiles = async (widgets: Widget[], basePath: string): Promise<void[]> => {
  return Promise.all(widgets.map(async w => {
    const data = await fs.readFile(path.join(__dirname, 'templates', 'Widget.mst'));
    const renderedFile = Mustache.render(data.toString(), {
    });
    return fs.writeFile(path.join(basePath, `${w.name}.js`), renderedFile);
  }));
};

export default generateWidgetFiles;