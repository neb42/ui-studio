import { Element, Widget, CustomComponentInstance } from '@ui-studio/types';
import { Store } from 'types/store';
import {
  getWidgetsForRoot,
  getSelectedRootElement,
  getWidgetsInSelectedTree,
  getElement,
} from 'selectors/tree';
import { getSelectedRootId } from 'selectors/view';
import { OpenAPIV3 } from 'openapi-types';
import { compareSchemas } from 'utils/openapi';

export const generateDefaultName = (state: Store, regex: string) => {
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

export const getOrphanedRootElements = (state: Store): (Widget | CustomComponentInstance)[] => {
  const widgets = getWidgetsInSelectedTree(state);
  return widgets.filter((w) => w.parent === null);
};

export const getAvailableIteratorKeys = (state: Store) => (
  widgetId: string,
  schema?: OpenAPIV3.SchemaObject,
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
    if (element.rootElement || !element.parent) return [element];
    const parentElements = getBranch(element.parent);
    return [...parentElements, element];
  };

  const parentElements = getBranch(widgetId);
  return parentElements.reduce<{ widgetId: string; widgetName: string; propKeys: string[] }[]>(
    (acc, cur) => {
      if (cur.id === widgetId || cur.rootElement) return acc;
      const propSchemaLookup: Record<
        string,
        { schema: OpenAPIV3.SchemaObject; iterable: boolean }
      > = (() => {
        if (cur.type === 'widget') {
          const config = state.configuration.components.find((c) => c.key === cur.component);
          if (!config || !config.config) return {};
          return config.config.reduce((a, c) => {
            return {
              ...acc,
              [c.key]: {
                schema: c.schema,
                iterable: c.iterable,
              },
            };
          }, {});
        }
        if (cur.type === 'customComponentInstance') {
          const config = state.customComponent[cur.customComponentId];
          if (!config.config) return {};
          return config.config.reduce((a, c) => {
            return {
              ...acc,
              [c.key]: {
                schema: c.schema,
                iterable: c.iterable,
              },
            };
          }, {});
        }
        throw new Error();
      })();
      const iterablePropKeys = Object.keys(cur.props).reduce<string[]>((a, c) => {
        const iterableSchema = propSchemaLookup[c].schema;
        if (iterableSchema.type === 'array' && propSchemaLookup[c].iterable) {
          const iterableArrayItemSchema = (iterableSchema as OpenAPIV3.ArraySchemaObject).items;
          if ('ref' in iterableArrayItemSchema) throw new Error();
          if (
            !schema ||
            compareSchemas(iterableArrayItemSchema as OpenAPIV3.SchemaObject, schema)
          ) {
            return [...a, c];
          }
        }
        return a;
      }, []);
      if (iterablePropKeys.length === 0) return acc;
      return [...acc, { widgetId: cur.id, widgetName: cur.name, propKeys: iterablePropKeys }];
    },
    [],
  );
};
