import { createSelector } from 'reselect';
import { Widget, Layout, Component, FunctionDefinition, ActionDefinition } from 'canvas-types';
import {
  Store,
  Store$Page,
  Store$Layout,
  Store$Widget,
  Store$Overlay,
  Store$Variable,
} from 'types/store';
import { TreeItem } from '@atlaskit/tree';

export const getPages = (state: Store): Store$Page => state.page;
export const getOverlays = (state: Store): Store$Overlay => state.overlay;
export const getLayouts = (state: Store): Store$Layout => state.layout;
export const getWidgets = (state: Store): Store$Widget => state.widget;
export const getVariables = (state: Store): Store$Variable => state.variable;
export const getSelectedElementId = (state: Store): string | null => state.element.selectedElement;
export const getHoverElementId = (state: Store): string | null => state.element.hoverElement;
export const getSelectedPageId = (state: Store): string | null => state.element.selectedPage;
export const getSelectedOverlayId = (state: Store): string | null => state.element.selectedOverlay;
export const getSelectedVariableId = (state: Store): string | null =>
  state.element.selectedVariable;
export const getSelectedView = (state: Store): 'preview' | 'variable' | 'css' =>
  state.element.selectedView;
export const getComponents = (state: Store): Component[] => state.element.components;

export const getElementTree = createSelector(
  getPages,
  getLayouts,
  getWidgets,
  getComponents,
  (pages, layouts, widgets, components) => {
    const all = {
      ...pages,
      ...layouts,
      ...widgets,
    };

    const componentMap = components.reduce<Record<string, Component>>(
      (acc, cur) => ({ ...acc, [cur.name]: cur }),
      {},
    );

    const tree: Record<string, TreeItem> = Object.keys(all).reduce((acc, cur) => {
      const element = all[cur];
      return {
        ...acc,
        [cur]: {
          id: cur,
          children: [],
          hasChildren:
            (element.type !== 'widget' || componentMap[element.component]?.hasChildren) ?? true,
          data: {
            name: element.name,
            type: element.type,
            element,
          },
        },
      };
    }, {});

    Object.values(all).forEach((el) => {
      if (el.type === 'widget' || el.type === 'layout') {
        if (el.parent && tree[el.parent]) {
          tree[el.parent].children = [...tree[el.parent].children, el.id];
        }
      }
    });

    Object.keys(tree).forEach((key) => {
      tree[key].children = tree[key].children.sort((a, b) => {
        const posA = tree[a].data.element.position;
        const posB = tree[b].data.element.position;
        if (posA > posB) return 1;
        if (posA < posB) return -1;
        return 0;
      });
    });

    return tree;
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
        .filter((e) => e.parent === grid.id && !ignoreNames.includes(e.id))
        .map((e) => {
          if (e.style.type === 'grid') return e.style.layout;
          return null;
        })
        .filter(notEmpty);
    },
  );

export const generateDefaultName = createSelector(
  (_: Store, regex: string) => regex,
  getPages,
  getLayouts,
  getWidgets,
  (regex, pages, layouts, widgets) => {
    const pattern = new RegExp(`${regex}([0-9]*)`);
    const names = Object.values({ ...pages, ...layouts, ...widgets }).map((e) => e.name);
    const matchingNames = names.filter((n) => pattern.test(n));
    const indicies = matchingNames.map((n) => pattern.exec(n)?.[1]).filter((n) => n);
    return `${regex}${indicies.length === 0 ? 1 : Math.max(...indicies.map((n) => Number(n))) + 1}`;
  },
);

export const getNextPosition = createSelector(
  (_: Store, parentId: string) => parentId,
  getLayouts,
  getWidgets,
  (parentId, layouts, widgets) => {
    return [...Object.values(layouts), ...Object.values(widgets)].filter(
      (l) => l.parent === parentId,
    ).length;
  },
);

export const makeGetComponents = () => getComponents;

export const makeGetFunctions = () => (state: Store): FunctionDefinition[] =>
  state.element.functions;

export const makeGetActions = () => (state: Store): ActionDefinition[] => state.element.actions;

export const makeGetSelectedVariable = () =>
  createSelector(getSelectedVariableId, getVariables, (selectedVariableId, variables) =>
    selectedVariableId ? variables[selectedVariableId] : null,
  );

export const getParentElement = createSelector(
  (_: Store, elementId: string) => elementId,
  getPages,
  getLayouts,
  getWidgets,
  (elementId, pages, layouts, widgets) => {
    const getElement = (id: string) => {
      if (id in pages) return pages[id];
      if (id in layouts) return layouts[id];
      if (id in widgets) return widgets[id];
      return null;
    };
    const element = getElement(elementId);
    if (!element || element.type === 'page') return null;
    return getElement(element.parent);
  },
);

export const getOrphanedIds = (state: Store): string[] => {
  const tree = getElementTree(state);

  const getIdsInBranch = (id: string): string[] => {
    const children = tree[id].children.map((c) => c.toString());
    return children.reduce((acc, cur) => {
      return [...acc, ...getIdsInBranch(cur)];
    }, children);
  };

  const rootWidgetIds = Object.values(getWidgets(state))
    .filter((w) => w.parent === null)
    .map((w) => w.id);

  const rootLayoutIds = Object.values(getLayouts(state))
    .filter((l) => l.parent === null)
    .map((l) => l.id);

  let orphanedIds: string[] = [...rootWidgetIds, ...rootLayoutIds];

  rootWidgetIds.forEach((id) => {
    orphanedIds = [...orphanedIds, ...getIdsInBranch(id)];
  });

  rootLayoutIds.forEach((id) => {
    orphanedIds = [...orphanedIds, ...getIdsInBranch(id)];
  });

  return orphanedIds;
};

export const getWidgetsInTree = (state: Store): { [key: string]: Widget } => {
  const orphanedIds = getOrphanedIds(state);
  const allWidgets = getWidgets(state);

  return Object.keys(allWidgets)
    .filter((id) => !orphanedIds.includes(id))
    .reduce((acc, cur) => {
      return { ...acc, [cur]: allWidgets[cur] };
    }, {});
};

export const getOrphanedRootElements = (state: Store): (Layout | Widget)[] => {
  const elements = makeGetElements()(state);
  const all = { ...elements.layouts, ...elements.widgets };

  const rootWidgetIds = Object.values(getWidgets(state))
    .filter((w) => w.parent === null)
    .map((w) => w.id);

  const rootLayoutIds = Object.values(getLayouts(state))
    .filter((l) => l.parent === null)
    .map((l) => l.id);

  return [...rootWidgetIds, ...rootLayoutIds].map((id) => all[id]);
};
