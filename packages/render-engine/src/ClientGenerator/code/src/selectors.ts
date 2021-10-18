import {
  FunctionVariableArg,
  WidgetProp,
  Value$CustomComponentConfig,
  Value$Iterable,
} from '@ui-studio/types';
import { OpenAPIV3 } from 'openapi-types';

import { Components } from './Components';
import { getResponseSchemaForEndpoint } from './openapi';
import { lookupValue } from './parseLookup';
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

export const getVariableValue = (state: Store) => (variableId: string, lookup: string | null) => {
  let variable = state.variable.value[variableId];
  const variableConfig = state.variable.config[variableId];

  if (!variableConfig) return null;
  if (!variable && variableConfig.type !== 'lookup') return null;

  try {
    if (variableConfig.type === 'static') {
      if (variableConfig.valueType === 'object') {
        if (typeof variable === 'string') {
          variable = JSON.parse(variable);
        }
      }
    }

    if (variableConfig.type === 'function') {
      const schema = getResponseSchemaForEndpoint(
        state.variable.openAPISchema,
        variableConfig.functionId.path,
        variableConfig.functionId.method,
      );
      if (schema.type === 'object' || schema.type === 'array') {
        if (typeof variable === 'string') {
          variable = JSON.parse(variable);
        }
      }
    }

    if (variableConfig.type === 'lookup') {
      variable = getVariableValue(state)(variableConfig.variableId, variableConfig.lookup);
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
          value: lookupValue(variable.value, lookup),
        };
      } catch {
        return { ...variable, error: true, value: null };
      }
    }
    try {
      return lookupValue(variable, lookup);
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
      const v = getVariableValue(state)(arg.variableId, null);
      if (
        JSON.stringify(Object.keys(v).sort()) ===
        JSON.stringify(['error', 'loading', 'value'].sort())
      ) {
        return v.value;
      }
      return v;
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
