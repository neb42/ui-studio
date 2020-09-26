import { createSelector, OutputParametricSelector } from 'reselect';
import Graph from 'graph-data-structure';
import { ElementTreeNode } from '@ui-builder/types';
import { Store, Store$Page, Store$Layout, Store$Widget } from 'types/store';

export const getPages = (state: Store): Store$Page => state.page;
export const getLayouts = (state: Store): Store$Layout => state.layout;
export const getWidgets = (state: Store): Store$Widget => state.widget;
export const getSelectedElementId = (state: Store): string | null => state.element.selectedElement;

export const makeGetElementTree = (): OutputParametricSelector<
  Store,
  string,
  ElementTreeNode | null,
  (
    pageName: string,
    pages: Store$Page,
    layouts: Store$Layout,
    widgets: Store$Widget,
  ) => ElementTreeNode | null
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
          id: element.id,
          name: element.name,
          type: element.type,
          position: element.type === 'page' ? 0 : element.position,
          element,
          children: children.map(buildTree),
        };
      };

      const elementTree = buildTree(pageName);
      return elementTree;
    },
  );

export const makeGetSelectedElement = () =>
  createSelector(
    getSelectedElementId,
    getPages,
    getLayouts,
    getWidgets,
    (selectedElementId, pages, layouts, widgets) => {
      if (selectedElementId === null) return null;
      if (selectedElementId in pages) return pages[selectedElementId];
      if (selectedElementId in layouts) return layouts[selectedElementId];
      if (selectedElementId in widgets) return widgets[selectedElementId];
      return null;
    },
  );

export const makeGetElement = () =>
  createSelector(
    (_: Store, elementId: string | null) => elementId,
    getPages,
    getLayouts,
    getWidgets,
    (elementId, pages, layouts, widgets) => {
      if (!elementId) return null;
      if (elementId in pages) return pages[elementId];
      if (elementId in layouts) return layouts[elementId];
      if (elementId in widgets) return widgets[elementId];
      return null;
    },
  );

export const makeGetElements = () =>
  createSelector(getPages, getLayouts, getWidgets, (pages, layouts, widgets) => {
    return {
      pages,
      layouts,
      widgets,
    };
  });

export const makeIsValidElementName = () =>
  createSelector(getPages, getLayouts, getWidgets, (pages, layouts, widgets) => {
    return (name: string) =>
      ![...Object.keys(pages), ...Object.keys(layouts), ...Object.keys(widgets)].includes(name);
  });

export const makeGetUsedGridSpace = () =>
  createSelector(
    (_: Store, gridElementId: string, ignoreNames: string[]) => ({ gridElementId, ignoreNames }),
    getLayouts,
    getWidgets,
    ({ gridElementId, ignoreNames }, layouts, widgets) => {
      const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
        return value !== null && value !== undefined;
      };
      const grid = layouts[gridElementId];
      return [...Object.values(layouts), ...Object.values(widgets)]
        .filter((e) => e.parent === grid.name && !ignoreNames.includes(e.name))
        .map((e) => {
          if (e.style.type === 'grid') return e.style.layout;
          return null;
        })
        .filter(notEmpty);
    },
  );

export const makeGenerateDefaultName = () =>
  createSelector(
    (_: Store, regex: string) => regex,
    getPages,
    getLayouts,
    getWidgets,
    (regex, pages, layouts, widgets) => {
      const pattern = new RegExp(`${regex}([0-9]*)`);
      const names = [...Object.keys(pages), ...Object.keys(layouts), ...Object.keys(widgets)];
      const matchingNames = names.filter((n) => pattern.test(n));
      const indicies = matchingNames.map((n) => pattern.exec(n)?.[1]).filter((n) => n);
      return `${regex}${
        indicies.length === 0 ? 1 : Math.max(...indicies.map((n) => Number(n))) + 1
      }`;
    },
  );

export const makeGetNextPosition = () =>
  createSelector(
    (_: Store, parentName: string) => parentName,
    getLayouts,
    getWidgets,
    (parentName, layouts, widgets) => {
      return [...Object.values(layouts), ...Object.values(widgets)].filter(
        (l) => l.parent === parentName,
      ).length;
    },
  );
