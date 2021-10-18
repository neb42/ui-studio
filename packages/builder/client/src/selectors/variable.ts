import { Store, Store$Variable } from 'types/store';
import { getSelectedVariableId } from 'selectors/view';
import { Variable } from '@ui-studio/types';

export const getVariables = (state: Store): Store$Variable => state.variable;

export const getSelectedVariable = (state: Store) => {
  const selectedVariableId = getSelectedVariableId(state);
  if (!selectedVariableId) return null;
  const varialbes = getVariables(state);
  return varialbes[selectedVariableId];
};

export const getVariable = (state: Store) => (variableId: string): Variable =>
  state.variable[variableId];
