import { Store, Store$Variable } from 'types/store';
import { getSelectedVariableId } from 'selectors/view';

export const getVariables = (state: Store): Store$Variable => state.variable;

export const getSelectedVariable = (state: Store) => {
  const selectedVariableId = getSelectedVariableId(state);
  if (!selectedVariableId) return null;
  const varialbes = getVariables(state);
  return varialbes[selectedVariableId];
};
