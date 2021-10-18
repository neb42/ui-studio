import { Dispatch } from 'redux';

import { GetState } from '../types/store';

import { updateFunctionVariable } from './updateFunctionVariable';
import { triggerAction } from './triggerAction';

export const handleEvent = (
  widgetId: string,
  eventKey: string,
  push: (path: string) => void,
  event?: any,
) => (dispatch: Dispatch<any>, getState: GetState): void => {
  const state = getState();
  const eventInstances = state.widget.config[widgetId].events[eventKey];
  eventInstances.forEach((ei) => {
    switch (ei.type) {
      case 'update-variable': {
        dispatch(updateFunctionVariable(ei.variableId, event));
        break;
      }
      case 'trigger-action': {
        dispatch(triggerAction(ei, event));
        break;
      }
      case 'navigate-page': {
        push(`/${ei.pageId}`);
        break;
      }
      default:
        break;
    }
  });
};
