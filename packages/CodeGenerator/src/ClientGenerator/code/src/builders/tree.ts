import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import Graph from 'graph-data-structure';
import { ElementTreeNode, Widget, Page, Layout } from '@ui-builder/types';

import { Store, KeyedObject } from '../types/store';

const getElements = createSelector<
  Store,
  KeyedObject<Widget>,
  KeyedObject<Page>,
  KeyedObject<Layout>,
  {
    widgets: KeyedObject<Widget>;
    pages: KeyedObject<Page>;
    layouts: KeyedObject<Layout>;
  }
>(
  (state) => state.widget.config,
  (state) => state.page.config,
  (state) => state.layout.config,
  (widgets, pages, layouts) => ({ widgets, pages, layouts }),
);

export const useBuildTree = (): ElementTreeNode[] => {
  const { widgets, pages, layouts } = useSelector(getElements);

  const all = { ...pages, ...layouts, ...widgets };

  const elementGraph = Graph();
  Object.keys(all).forEach((k) => elementGraph.addNode(k));
  Object.values({ ...widgets, ...layouts }).forEach((v) => elementGraph.addEdge(v.parent, v.id));

  const buildTree = (node: string): ElementTreeNode => {
    const element = all[node];
    const children = elementGraph.adjacent(node);
    return {
      id: element.id,
      name: element.name,
      type: element.type,
      position: element.type === 'page' ? 0 : element.position,
      children: children.map(buildTree).sort((a, b) => (a.position > b.position ? 1 : -1)),
      element,
    };
  };

  const elementTree: ElementTreeNode[] = Object.keys(pages).map(buildTree);

  return elementTree;
};
