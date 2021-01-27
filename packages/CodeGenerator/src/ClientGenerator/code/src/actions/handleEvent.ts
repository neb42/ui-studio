import { Dispatch } from 'redux';

import { updateFunctionVariable } from './updateFunctionVariable';
import { triggerAction } from './triggerAction';
import { GetState } from '../types/store';

export const handleEvent = (
  widgetId: string,
  eventKey: string,
  push: (path: string) => void,
) => (dispatch: Dispatch<any>, getState: GetState) => {
  const state = getState();
  const eventInstances = state.widget.config[widgetId].events[eventKey];
  eventInstances.forEach((ei) => {
    switch (ei.type) {
      case 'update-variable':
        return dispatch(updateFunctionVariable(ei.variableId));
      case 'trigger-action':
        return dispatch(triggerAction(ei.actionId, ei.args));
      case 'navigate-page':
        return push(`/${ei.pageId}`);
      default:
        return;
    }
  });
};