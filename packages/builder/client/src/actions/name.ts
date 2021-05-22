import { Dispatch } from 'redux';
import { TGetState, TThunkAction } from 'types/store';
import { getSelectedRootId } from 'selectors/view';
import { getSelectedElement } from 'selectors/tree';

export interface UpdatePageName {
  type: 'UPDATE_PAGE_NAME';
  payload: {
    rootId: string;
    name: string;
  };
}

export const UPDATE_PAGE_NAME = 'UPDATE_PAGE_NAME';

export interface UpdateCustomComponentName {
  type: 'UPDATE_CUSTOM_COMPONENT_NAME';
  payload: {
    rootId: string;
    name: string;
  };
}

export const UPDATE_CUSTOM_COMPONENT_NAME = 'UPDATE_CUSTOM_COMPONENT_NAME';

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
): TThunkAction<UpdatePageName | UpdateCustomComponentName | UpdateWidgetName> => (
  dispatch: Dispatch<UpdatePageName | UpdateCustomComponentName | UpdateWidgetName>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const selectedElement = getSelectedElement(state);
  if (!rootId || !selectedElement) throw Error();
  if (selectedElement.type === 'page') {
    return dispatch({
      type: UPDATE_PAGE_NAME,
      payload: {
        rootId,
        name,
      },
    });
  }
  if (selectedElement.type === 'customComponent') {
    return dispatch({
      type: UPDATE_PAGE_NAME,
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
      widgetId: selectedElement.id,
      name,
    },
  });
};
