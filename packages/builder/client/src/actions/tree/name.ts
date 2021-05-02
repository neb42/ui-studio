import { Dispatch } from 'redux';

import { TGetState, TThunkAction } from 'types/store';
import { getSelectedRootId, getSelectedElementId } from 'selectors/view';

export interface UpdateRootName {
  type: 'UPDATE_ROOT_NAME';
  payload: {
    rootId: string;
    name: string;
  };
}

export const UPDATE_ROOT_NAME = 'UPDATE_ROOT_NAME';

export interface UpdateWidgetName {
  type: 'UPDATE_WIDGET_NAME';
  payload: {
    rootId: string;
    widgetId: string;
    name: string;
  };
}

export const UPDATE_WIDGET_NAME = 'UPDATE_WIDGET_NAME';

export const updateElementName = (
  name: string,
): TThunkAction<UpdateRootName | UpdateWidgetName> => (
  dispatch: Dispatch<UpdateRootName | UpdateWidgetName>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const widgetId = getSelectedElementId(state);
  if (!rootId || !widgetId) throw Error();
  if (rootId === widgetId) {
    return dispatch({
      type: UPDATE_ROOT_NAME,
      payload: {
        rootId,
        name,
      },
    });
  }
  return dispatch({
    type: UPDATE_WIDGET_NAME,
    payload: {
      rootId,
      widgetId,
      name,
    },
  });
};
