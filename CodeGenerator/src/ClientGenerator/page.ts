import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const generatePageFiles = (pages: Page[], basePath: string) => {
  return Promise.all(pages.map(async p => {
    const [data, recursiveImport, recursiveElement]  = await Promise.all([
      fs.readFile(path.join(__dirname, 'templates', 'Page.mst')),
      fs.readFile(path.join(__dirname, 'templates', 'RecursiveImport.mst')),
      fs.readFile(path.join(__dirname, 'templates', 'RecursiveElement.mst')),
    ]);
    const renderedFile = Mustache.render(data.toString(), {
      name: p.name,
      children: p.children,
    }, {
      recursive_import: recursiveImport.toString(),
      recursive_element: recursiveElement.toString(),
    });
    return fs.writeFile(path.join(basePath, `${p.name}.js`), renderedFile);
  }));
};

export default generatePageFiles;