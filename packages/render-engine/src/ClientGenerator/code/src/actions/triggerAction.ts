import axios from 'axios';
import { Dispatch } from 'redux';

export interface TriggerAction$Pending {
  type: 'ACTION_API_CALL_PENDING';
  payload: {
    id: string;
  };
}

export interface TriggerAction$Fulfilled {
  type: 'ACTION_API_CALL_FULFILLED';
  payload: {
    id: string;
  };
}

export interface TriggerAction$Rejected {
  type: 'ACTION_API_CALL_REJECTED';
  payload: {
    id: string;
  };
}

export const ACTION_API_CALL_PENDING = 'ACTION_API_CALL_PENDING';
export const ACTION_API_CALL_FULFILLED = 'ACTION_API_CALL_FULFILLED';
export const ACTION_API_CALL_REJECTED = 'ACTION_API_CALL_REJECTED';

export const triggerAction = (id: string, args: any, event?: any) => async (
  dispatch: Dispatch<TriggerAction$Pending | TriggerAction$Fulfilled | TriggerAction$Rejected>,
): Promise<void> => {
  try {
    dispatch({
      type: ACTION_API_CALL_PENDING,
      payload: { id },
    });

    const { status } = await axios.post(`/api/action_${id}`, { event, args });

    if (status !== 200) throw new Error(`Status code: ${status}`);

    dispatch({
      type: ACTION_API_CALL_FULFILLED,
      payload: { id },
    });
  } catch {
    dispatch({
      type: ACTION_API_CALL_REJECTED,
      payload: { id },
    });
  }
};
