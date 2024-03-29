import { Dispatch } from 'redux';

import { makeOpenAPIRequest } from '../openapi';
import { getVariableDefinitions, getVariableArgs } from '../selectors';
import { GetState } from '../types/store';

export interface UpdateFunctionVariable$Pending {
  type: 'FUNCTION_API_CALL_PENDING';
  payload: {
    id: string;
  };
}

export interface UpdateFunctionVariable$Fulfilled {
  type: 'FUNCTION_API_CALL_FULFILLED';
  payload: {
    id: string;
    data: any;
  };
}

export interface UpdateFunctionVariable$Rejected {
  type: 'FUNCTION_API_CALL_REJECTED';
  payload: {
    id: string;
  };
}

export const FUNCTION_API_CALL_PENDING = 'FUNCTION_API_CALL_PENDING';
export const FUNCTION_API_CALL_FULFILLED = 'FUNCTION_API_CALL_FULFILLED';
export const FUNCTION_API_CALL_REJECTED = 'FUNCTION_API_CALL_REJECTED';

export const updateFunctionVariable = (id: string, event?: any) => async (
  dispatch: Dispatch<
    | UpdateFunctionVariable$Pending
    | UpdateFunctionVariable$Fulfilled
    | UpdateFunctionVariable$Rejected
  >,
  getState: GetState,
): Promise<void> => {
  try {
    dispatch({
      type: FUNCTION_API_CALL_PENDING,
      payload: { id },
    });

    const state = getState();
    const variableDef = getVariableDefinitions(state)[id];

    if (variableDef.type !== 'function') {
      throw Error();
    }

    const { functionId } = variableDef;
    const args = getVariableArgs(state)(id);

    const data = await makeOpenAPIRequest(
      state,
      functionId.path,
      functionId.method,
      args.path,
      args.query,
      args.body,
      event,
    );

    dispatch({
      type: FUNCTION_API_CALL_FULFILLED,
      payload: { id, data },
    });
  } catch {
    dispatch({
      type: FUNCTION_API_CALL_REJECTED,
      payload: { id },
    });
  }
};
