import {
  FunctionVariableArg,
  WidgetProp,
  Value$CustomComponentConfig,
  Value$Iterable,
  Component,
} from '@ui-studio/types';
import { OpenAPIV3 } from 'openapi-types';

import { Components } from './Components';
import { Store } from './types/store';

export const getWidgetPropertyValue = (state: Store) => (
  widgetId: string,
  rootId: string | null,
  property: string,
) => {
  const widgetConfig = state.widget.config[widgetId];
  if (!widgetConfig) return null;
  const widgetValue = (() => {
    if (rootId) {
      return state.widget.value?.[rootId]?.[widgetId];
    }
    return state.widget.value?.[widgetId];
  })();
  if (widgetConfig.type === 'customComponentInstance') {
    const root = state.root.config[widgetConfig.customComponentId];
    if (root.type !== 'customComponent' || !root.exposedProperties) return null;
    return state.widget.value[widgetId][root.exposedProperties[property].widgetId][
      root.exposedProperties[property].property
    ];
  }
  return widgetValue?.[property] ?? null;
};

export const getVariableDefinitions = (state: Store) => state.variable.config;

const parseLookup = (variable: any, lookup: string) =>
  lookup.split('.').reduce((acc, cur) => (cur.length > 0 ? acc[cur] : acc), variable);

export const getVariableValue = (state: Store) => (variableId: string, lookup: string | null) => {
  let variable = state.variable.value[variableId];
  const variableConfig = state.variable.config[variableId];
  if (!variable) return null;

  try {
    if (variableConfig.type === 'static') {
      if (variableConfig.valueType === 'object') {
        if (typeof variable === 'string') {
          variable = JSON.parse(variable);
        }
      }
    }

    if (variableConfig.type === 'function') {
      const responses =
        state.variable.openAPISchema.paths?.[variableConfig.functionId.path]?.[
          variableConfig.functionId.method
        ]?.responses;
      if (!responses) throw new Error();
      const responseCode = Object.keys(responses).find((c) => Number(c) >= 200 && Number(c) < 300);
      if (!responseCode) throw new Error();
      const response = responses[responseCode];
      if ('ref' in response) throw new Error();
      let schema = (response as OpenAPIV3.ResponseObject).content?.['application/json']?.schema;
      if (!schema || 'ref' in schema) throw new Error();
      schema = schema as OpenAPIV3.SchemaObject;
      if (schema.type === 'object' || schema.type === 'array') {
        if (typeof variable === 'string') {
          variable = JSON.parse(variable);
        }
      }
    }
  } catch {}

  if (lookup && lookup.length > 0) {
    if (
      JSON.stringify(Object.keys(variable).sort()) ===
      JSON.stringify(['error', 'loading', 'value'].sort())
    ) {
      try {
        return {
          ...variable,
          value: parseLookup(variable.value, lookup),
        };
      } catch {
        return { ...variable, error: true, value: null };
      }
    }
    try {
      return parseLookup(variable, lookup);
    } catch {
      return null;
    }
  }
  return variable;
};

export const resolveArgSet = (state: Store, args: Record<string, FunctionVariableArg>) => {
  const resolveArg = (arg: FunctionVariableArg) => {
    if (arg.mode === 'static') {
      return arg.value;
    }

    if (arg.mode === 'variable') {
      return getVariableValue(state)(arg.variableId, null);
    }

    if (arg.mode === 'widget') {
      return getWidgetPropertyValue(state)(arg.widgetId, null, arg.property);
    }

    return null;
  };

  return Object.keys(args).reduce<Record<string, any>>((acc, cur) => {
    return {
      ...acc,
      [cur]: resolveArg(args[cur]),
    };
  }, {});
};

export const getVariableArgs = (state: Store) => (variableId: string) => {
  const variable = getVariableDefinitions(state)[variableId];
  if (variable.type !== 'function')
    return {
      path: {},
      query: {},
      body: {},
    };

  return variable.args;
};

export const getCustomComponentConfigProp = (state: Store) => (
  rootId: string | null,
  prop: Value$CustomComponentConfig,
  iteratorIndex: { [widgetId: string]: { [prop: string]: number } },
): any | null => {
  if (!rootId) return null;
  const p = state.widget.config[rootId].props[prop.configKey];
  return getProp(state)(rootId, null, p, iteratorIndex);
};

export const getProp = (state: Store) => (
  widgetId: string,
  rootId: string | null,
  prop: WidgetProp,
  iteratorIndex: { [widgetId: string]: { [prop: string]: number } },
): any | null => {
  if (prop.mode === 'list') {
    return prop.props.map((p) => getProp(state)(widgetId, rootId, p, iteratorIndex));
  }

  if (prop.mode === 'iterable') {
    return getIterableValue(state)(widgetId, rootId, prop, iteratorIndex);
  }

  if (prop.mode === 'complex') {
    return Object.keys(prop.props).reduce(
      (a, c) => ({ ...a, [c]: getProp(state)(widgetId, rootId, prop.props[c], iteratorIndex) }),
      {},
    );
  }

  if (prop.mode === 'customComponentConfig') {
    return getCustomComponentConfigProp(state)(rootId, prop, iteratorIndex);
  }

  if (prop.mode === 'variable') {
    return getVariableValue(state)(prop.variableId, prop.lookup || null);
  }

  if (prop.mode === 'widget') {
    return getWidgetPropertyValue(state)(prop.widgetId, rootId, prop.property);
  }

  if (prop.mode === 'static') {
    if (typeof prop.value === 'string') {
      try {
        return JSON.parse(prop.value);
      } catch {
        return prop.value;
      }
    }
    return prop.value;
  }

  return null;
};

export const getIterableValue = (state: Store) => (
  sourceWidgetId: string,
  rootId: string | null,
  widgetProp: Value$Iterable,
  iteratorIndex: { [widgetId: string]: { [prop: string]: number } },
): any => {
  try {
    const position = iteratorIndex[widgetProp.widgetId][widgetProp.propKey];
    const widget = state.widget.config[widgetProp.widgetId];
    const iteratorValue = getProp(state)(
      widget.id,
      rootId,
      widget.props[widgetProp.propKey],
      iteratorIndex,
    );
    if (!Array.isArray(iteratorValue)) throw Error();
    const itemValue = iteratorValue[position];
    if (widgetProp.lookup && widgetProp.lookup.length > 0) return itemValue[widgetProp.lookup];
    return itemValue;
  } catch {
    return [];
  }
};
