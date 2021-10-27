import { Event$TriggerAction } from '@ui-studio/types';
import { Dispatch } from 'redux';

import { makeOpenAPIRequest } from '../openapi';
import { GetState } from '../types/store';

export interface TriggerAction$Pending {
  type: 'ACTION_API_CALL_PENDING';
  payload: {
    id: Event$TriggerAction['actionId'];
  };
}

export interface TriggerAction$Fulfilled {
  type: 'ACTION_API_CALL_FULFILLED';
  payload: {
    id: Event$TriggerAction['actionId'];
  };
}

export interface TriggerAction$Rejected {
  type: 'ACTION_API_CALL_REJECTED';
  payload: {
    id: Event$TriggerAction['actionId'];
  };
}

export const ACTION_API_CALL_PENDING = 'ACTION_API_CALL_PENDING';
export const ACTION_API_CALL_FULFILLED = 'ACTION_API_CALL_FULFILLED';
export const ACTION_API_CALL_REJECTED = 'ACTION_API_CALL_REJECTED';

export const triggerAction = (
  eventInstance: Event$TriggerAction,
  rootId: string | null,
  event?: any,
) => async (
  dispatch: Dispatch<TriggerAction$Pending | TriggerAction$Fulfilled | TriggerAction$Rejected>,
  getState: GetState,
): Promise<void> => {
  try {
    dispatch({
      type: ACTION_API_CALL_PENDING,
      payload: { id: eventInstance.actionId },
    });

    const state = getState();

    await makeOpenAPIRequest(
      state,
      eventInstance.actionId.path,
      eventInstance.actionId.method,
      eventInstance.args.path,
      eventInstance.args.query,
      eventInstance.args.body,
      rootId,
      event,
    );

    dispatch({
      type: ACTION_API_CALL_FULFILLED,
      payload: { id: eventInstance.actionId },
    });
  } catch {
    dispatch({
      type: ACTION_API_CALL_REJECTED,
      payload: { id: eventInstance.actionId },
    });
  }
};
