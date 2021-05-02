import { Element, Widget } from '@ui-studio/types';
import { Store } from 'types/store';
import {
  getWidgetsForRoot,
  getSelectedRootElement,
  getWidgetsInSelectedTree,
  getElement,
} from 'selectors/tree';
import { getSelectedRootId } from 'selectors/view';

export const generateDefaultName = (state: State, regex: string) => {
  const root = getSelectedRootElement(state);
  if (!root) throw Error();
  const widgets = getWidgetsForRoot(state, root.id);
  const pattern = new RegExp(`${regex}([0-9]*)`);
  const names = [root, ...widgets].map((e) => e.name);
  const matchingNames = names.filter((n) => pattern.test(n));
  const indicies = matchingNames.map((n) => pattern.exec(n)?.[1]).filter((n) => n);
  return `${regex}${indicies.length === 0 ? 1 : Math.max(...indicies.map((n) => Number(n))) + 1}`;
};

export const getNextPosition = (state: Store, parentId: string) => {
  const widgets = getWidgetsInSelectedTree(state);
  return [...Object.values(widgets)].filter((l) => l.parent === parentId).length;
};

// export const getOrphanedIds = (state: Store): string[] => {
//   const tree = getSelectedTree(state);

//   const getIdsInBranch = (id: string): string[] => {
//     const children = tree[id].children.map((c) => c.toString());
//     return children.reduce((acc, cur) => {
//       return [...acc, ...getIdsInBranch(cur)];
//     }, children);
//   };

//   const rootWidgetIds = Object.values(getWidgets(state))
//     .filter((w) => w.parent === null)
//     .map((w) => w.id);

//   let orphanedIds: string[] = [...rootWidgetIds];

//   rootWidgetIds.forEach((id) => {
//     orphanedIds = [...orphanedIds, ...getIdsInBranch(id)];
//   });

//   return orphanedIds;
// };

export const getOrphanedRootElements = (state: Store): Widget[] => {
  const widgets = getWidgetsInSelectedTree(state);
  return widgets.filter((w) => w.parent === null);
};

export const getAvailableIteratorKeys = (state: Store) => (
  widgetId: string,
): {
  widgetId: string;
  widgetName: string;
  propKeys: string[];
}[] => {
  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();
  const getBranch = (elementId: string): Element[] => {
    const element = getElement(state, rootId, elementId);
    if (!element) throw Error();
    if (element.type !== 'widget' || !element.parent) return [element];
    const parentElements = getBranch(element.parent);
    return [...parentElements, element];
  };

  const parentElements = getBranch(widgetId);
  return parentElements.reduce<{ widgetId: string; widgetName: string; propKeys: string[] }[]>(
    (acc, cur) => {
      if (cur.id === widgetId || cur.type !== 'widget') return acc;
      const iterablePropKeys = Object.keys(cur.props).reduce<string[]>((a, c) => {
        const prop = cur.props[c];
        if (
          (prop.mode === 'list' || (prop.mode === 'static' && prop.type === 'object')) &&
          prop.iterable
        )
          return [...a, c];
        return a;
      }, []);
      if (iterablePropKeys.length === 0) return acc;
      return [...acc, { widgetId: cur.id, widgetName: cur.name, propKeys: iterablePropKeys }];
    },
    [],
  );
};
