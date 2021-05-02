import { Dispatch } from 'redux';
import { TStyle, BaseStyle } from '@ui-studio/types';

import { TGetState, TThunkAction } from 'types/store';
import { getSelectedRootId, getSelectedElementId } from 'selectors/view';
import { getSelectedElement } from 'selectors/tree';

export interface UpdateRootStyle {
  type: 'UPDATE_ROOT_STYLE';
  payload: {
    rootId: string;
    style: BaseStyle;
  };
}

export const UPDATE_ROOT_STYLE = 'UPDATE_ROOT_STYLE';

export interface UpdateWidgetStyle {
  type: 'UPDATE_WIDGET_STYLE';
  payload: {
    rootId: string;
    widgetId: string;
    style: TStyle;
  };
}

export const UPDATE_WIDGET_STYLE = 'UPDATE_WIDGET_STYLE';

export const updateElementClassNames = (
  classNames: string,
): TThunkAction<UpdateRootStyle | UpdateWidgetStyle> => (
  dispatch: Dispatch<UpdateRootStyle | UpdateWidgetStyle>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const selectedElement = getSelectedElement(state);
  if (!rootId || !selectedElement) throw Error();
  if (rootId === selectedElement.id && selectedElement.type !== 'widget') {
    return dispatch({
      type: UPDATE_ROOT_STYLE,
      payload: {
        rootId,
        style: {
          ...selectedElement.style,
          classNames,
        },
      },
    });
  }
  return dispatch({
    type: UPDATE_WIDGET_STYLE,
    payload: {
      rootId,
      widgetId: selectedElement.id,
      style: {
        ...selectedElement.style,
        classNames,
      },
    },
  });
};

export const updateElementCSS = (
  css: string,
): TThunkAction<UpdateRootStyle | UpdateWidgetStyle> => (
  dispatch: Dispatch<UpdateRootStyle | UpdateWidgetStyle>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const selectedElement = getSelectedElement(state);
  if (!rootId || !selectedElement) throw Error();
  if (rootId === selectedElement.id && selectedElement.type !== 'widget') {
    return dispatch({
      type: UPDATE_ROOT_STYLE,
      payload: {
        rootId,
        style: {
          ...selectedElement.style,
          css,
        },
      },
    });
  }
  return dispatch({
    type: UPDATE_WIDGET_STYLE,
    payload: {
      rootId,
      widgetId: selectedElement.id,
      style: {
        ...selectedElement.style,
        css,
      },
    },
  });
};

export const updateWidgetStyle = (style: TStyle): TThunkAction<UpdateWidgetStyle> => (
  dispatch: Dispatch<UpdateWidgetStyle>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const widgetId = getSelectedElementId(state);
  if (!rootId || !widgetId) throw Error();
  return dispatch({
    type: UPDATE_WIDGET_STYLE,
    payload: {
      rootId,
      widgetId,
      style,
    },
  });
};
