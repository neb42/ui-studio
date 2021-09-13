import { store } from './store';
import { getVariableDefinitions, getVariableArgs } from './selectors';
import {
  FUNCTION_API_CALL_PENDING,
  FUNCTION_API_CALL_FULFILLED,
  FUNCTION_API_CALL_REJECTED,
} from './actions/updateFunctionVariable';
import { Store } from './types/store';
import { makeOpenAPIRequest } from './openapi';

let currentValue: Store;

const handleChange = async () => {
  const previousValue = currentValue;

  currentValue = store.getState();

  const definitions = getVariableDefinitions(currentValue);

  Object.keys(definitions).forEach(async (id) => {
    const def = definitions[id];
    if (def.type === 'function' && def.trigger === 'auto') {
      const prev = previousValue ? getVariableArgs(previousValue)(id) : null;
      const current = currentValue ? getVariableArgs(currentValue)(id) : null;

      if (JSON.stringify(prev) !== JSON.stringify(current) || !previousValue) {
        try {
          store.dispatch({
            type: FUNCTION_API_CALL_PENDING,
            payload: { id },
          });

          const { functionId } = def;

          const data = await makeOpenAPIRequest(
            currentValue,
            functionId.path,
            functionId.method,
            current?.path ?? {},
            current?.query ?? {},
            current?.body ?? {},
          );

          store.dispatch({
            type: FUNCTION_API_CALL_FULFILLED,
            payload: { id, data },
          });
        } catch (error) {
          store.dispatch({
            type: FUNCTION_API_CALL_REJECTED,
            payload: { id },
          });
        }
      }
    }
  });
};

store.subscribe(handleChange);
