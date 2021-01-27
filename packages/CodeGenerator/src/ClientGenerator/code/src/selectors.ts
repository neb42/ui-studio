import { Store } from './types/store';

export const getWidgetPropertyValue = (state: Store) => (widgetId: string, property: string) => state.widget.value[widgetId][property];

export const getVariableDefinitions = (state: Store) => state.variable.config;

const parseLookup = (variable: any, lookup: string) => lookup.split('.').reduce((acc, cur) => cur.length > 0 ? acc[cur] : acc, variable);

export const getVariableValue = (state: Store) => (variableId: string, lookup: string | null) =>{
  const variable = state.variable.value[variableId];
  if (lookup && lookup.length > 0) {
    if (JSON.stringify(Object.keys(variable).sort()) === JSON.stringify(['error', 'loading', 'value'].sort())) {
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

export const getVariableArgs = (state: Store) => (variableId: string) => {
  const variable = getVariableDefinitions(state)[variableId];
  if (variable.type !== 'function') throw Error();

  return variable.args.map(a => {
    if (a.type === 'static') {
      return a.value;
    }

    if (a.type === 'variable') {
      return getVariableValue(state)(a.variableId, null);
    }

    if (a.type === 'widget') {
      return getVariableValue(state)(a.widgetId, a.property);
    }

    throw Error();
  });
};