import { createSelector, OutputParametricSelector } from 'reselect';
import Graph from 'graph-data-structure';
import { ElementTreeNode } from 'types/element';
import { Store, Store$Element$Page, Store$Element$Layout, Store$Element$Widget } from 'types/store';

export const getPages = (state: Store): Store$Element$Page => state.element.pages;
export const getLayouts = (state: Store): Store$Element$Layout => state.element.layouts;
export const getWidgets = (state: Store): Store$Element$Widget => state.element.widgets;
export const getSelectedElementName = (state: Store): string | null =>
  state.element.selectedElement;

export const makeGetElementTree = (): OutputParametricSelector<
  Store,
  string,
  ElementTreeNode,
  (
    pageName: string,
    pages: Store$Element$Page,
    layouts: Store$Element$Layout,
    widgets: Store$Element$Widget,
  ) => ElementTreeNode
> =>
  createSelector(
    (_: Store, pageName: string) => pageName,
    getPages,
    getLayouts,
    getWidgets,
    (pageName, pages, layouts, widgets) => {
      const all = {
        ...pages,
        ...layouts,
        ...widgets,
      };

      const elementGraph = Graph();
      Object.keys({ ...pages, ...layouts, ...widgets }).forEach((k) => elementGraph.addNode(k));
      Object.values({ ...widgets, ...layouts }).forEach((v) =>
        elementGraph.addEdge(v.parent, v.name),
      );

      const buildTree = (node: string): ElementTreeNode => {
        const element = all[node];
        const children = elementGraph.adjacent(node);
        return {
          name: element.name,
          type: element.type,
          children: children.map(buildTree),
        };
      };

      const elementTree = buildTree(pageName);
      return elementTree;
    },
  );

export const makeGetSelectedElement = () =>
  createSelector(
    getSelectedElementName,
    getPages,
    getLayouts,
    getWidgets,
    (selectedElementName, pages, layouts, widgets) => {
      if (selectedElementName === null) return null;
      if (selectedElementName in pages) return pages[selectedElementName];
      if (selectedElementName in layouts) return layouts[selectedElementName];
      if (selectedElementName in widgets) return widgets[selectedElementName];
      return null;
    },
  );
