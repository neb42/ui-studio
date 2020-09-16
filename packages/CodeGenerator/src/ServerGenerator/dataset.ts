import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { Dataset } from '../types';

const generateDatasetsFile = async (datasets: Dataset[], basePath: string): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'dataset.mst'));
  const renderedFile = Mustache.render(data.toString(), { datasets });
  return fs.writeFile(path.join(basePath, 'datasets.js'), renderedFile);
};

export default generateDatasetsFile;
