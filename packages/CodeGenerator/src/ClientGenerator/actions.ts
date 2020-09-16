import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

const generateUpdateWidgetActionFile = async (basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'UpdateWidgetAction.mst'));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(basePath, 'updateWidget.js'), renderedFile);
};

const generateActionFiles = async (basePath: string): Promise<void[]> => {
  return Promise.all([generateUpdateWidgetActionFile(basePath)]);
};

export default generateActionFiles;
