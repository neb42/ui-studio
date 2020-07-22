import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const generateGridLayoutFiles = async (layouts: Layout[], basePath: string): Promise<void[]> => {
  return Promise.all(layouts.map(async l => {
    const data = await fs.readFile(path.join(__dirname, 'templates', 'GridLayout.mst'));
    const renderedFile = Mustache.render(data.toString(), {
    });
    return fs.writeFile(path.join(basePath, `${l.name}.js`), renderedFile);
  }));
};

const generateFlexLayoutFiles = async (layouts: Layout[], basePath: string): Promise<void[]> => {
  return Promise.all(layouts.map(async l => {
    const data = await fs.readFile(path.join(__dirname, 'templates', 'FlexLayout.mst'));
    const renderedFile = Mustache.render(data.toString(), {
    });
    return fs.writeFile(path.join(basePath, `${l.name}.js`), renderedFile);
  }));
};

const generateLayoutFiles = async (layouts: Layout[], basePath: string): Promise<void[]> => {
  return Promise.all([
    ...(await generateGridLayoutFiles(layouts.filter(l => l.layoutType === 'grid'), basePath)),
    ...(await generateFlexLayoutFiles(layouts.filter(l => l.layoutType === 'flex'), basePath)),
  ]);
};

export default generateLayoutFiles;