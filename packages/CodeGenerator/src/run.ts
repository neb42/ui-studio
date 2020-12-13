import { promises as fs, existsSync } from 'fs';
import path from 'path';

import Graph from 'graph-data-structure';
import { Widget, Layout, Page, ElementTreeNode } from '@ui-builder/types';

import generateServer from './ServerGenerator/generateServer';
import generateClient from './ClientGenerator/generateClient';
import * as FakeData from './fakeData';
import { FilePaths } from './FilePaths';

type Data = {
  widgets: { [key: string]: Widget };
  layouts: { [key: string]: Layout };
  pages: { [key: string]: Page };
};

const mkdir = async (p: string) => {
  if (!existsSync(p)) {
    await fs.mkdir(p);
  }
};

const readData = async (source: string) => {
  const file = await (await fs.readFile(path.join(source, 'client.json'))).toString();
  return JSON.parse(file);
};

const setupDirectory = async () => {
  console.info('Creating directories...');
  // eslint-disable-next-line no-restricted-syntax
  for (const p of Object.values(FilePaths)) {
    await mkdir(p);
  }
  console.info('Finished creating directories...');
};

const buildElementTree = (data: Data): ElementTreeNode[] => {
  const { pages, layouts, widgets } = data;
  const all = { ...pages, ...layouts, ...widgets };

  const elementGraph = Graph();
  Object.keys(all).forEach((k) => elementGraph.addNode(k));
  Object.values({ ...widgets, ...layouts }).forEach((v) => elementGraph.addEdge(v.parent, v.id));

  const buildTree = (node: string) => {
    const element = all[node];
    const children = elementGraph.adjacent(node);
    return {
      id: element.id,
      name: element.name,
      type: element.type,
      children: children.map(buildTree).sort((a, b) => (a.position > b.position ? 1 : -1)),
    };
  };
  const elementTree: ElementTreeNode[] = Object.keys(pages).map(buildTree);
  return elementTree;
};

export const run = async (_data: Data | null, source: string, dev: boolean): Promise<void> => {
  const data = _data || (await readData(source));

  await setupDirectory();
  const elementTree = buildElementTree(data);

  generateClient({
    elementTree,
    widgets: Object.values(data.widgets),
    pages: Object.values(data.pages),
    layouts: Object.values(data.layouts),
    source,
    dev,
  });

  generateServer(source, dev);
};

if (typeof require !== 'undefined' && require.main === module) {
  try {
    run(
      {
        widgets: FakeData.widgets,
        layouts: FakeData.layouts,
        pages: FakeData.pages,
      },
      FakeData.source,
      true,
    );
  } catch (error) {
    console.log(error);
  }
}
