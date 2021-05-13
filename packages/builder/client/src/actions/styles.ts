import { Dispatch } from 'redux';
import { TStyle, BaseStyle } from '@ui-studio/types';
import { TGetState, TThunkAction } from 'types/store';
import { getSelectedRootId, getSelectedElementId } from 'selectors/view';
import { getSelectedElement } from 'selectors/tree';

export interface UpdatePageStyle {
  type: 'UPDATE_PAGE_STYLE';
  payload: {
    rootId: string;
    style: BaseStyle;
  };
}

export const UPDATE_PAGE_STYLE = 'UPDATE_PAGE_STYLE';

export interface UpdateCustomComponentStyle {
  type: 'UPDATE_CUSTOM_COMPONENT_STYLE';
  payload: {
    rootId: string;
    style: BaseStyle;
  };
}

export const UPDATE_CUSTOM_COMPONENT_STYLE = 'UPDATE_CUSTOM_COMPONENT_STYLE';

export interface UpdateWidgetStyle {
  type: 'UPDATE_WIDGET_STYLE';
  payload: {
    rootId: string;
    widgetId: string;
    style: TStyle;
  };
}

export const UPDATE_WIDGET_STYLE = 'UPDATE_WIDGET_STYLE';

const updateStyle = (
  style: TStyle,
): TThunkAction<UpdatePageStyle | UpdateCustomComponentStyle | UpdateWidgetStyle> => (
  dispatch: Dispatch<UpdatePageStyle | UpdateCustomComponentStyle | UpdateWidgetStyle>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const selectedElement = getSelectedElement(state);
  if (!rootId || !selectedElement) throw Error();
  if (selectedElement.type === 'page') {
    return dispatch({
      type: UPDATE_PAGE_STYLE,
      payload: {
        rootId,
        style: style as BaseStyle,
      },
    });
  }
  if (selectedElement.type === 'customComponent') {
    return dispatch({
      type: UPDATE_PAGE_STYLE,
      payload: {
        rootId,
        style: style as BaseStyle,
      },
    });
  }
  return dispatch({
    type: UPDATE_WIDGET_STYLE,
    payload: {
      rootId,
      widgetId: selectedElement.id,
      style,
    },
  });
};

export const updateElementClassNames = (classNames: string): TThunkAction<any> => (
  dispatch: Dispatch<any>,
  getState: TGetState,
) => {
  const state = getState();
  const selectedElement = getSelectedElement(state);
  if (!selectedElement) throw Error();
  const style = {
    ...selectedElement.style,
    classNames,
  };
  return dispatch(updateStyle(style));
};

export const updateElementCSS = (css: string): TThunkAction<any> => (
  dispatch: Dispatch<any>,
  getState: TGetState,
) => {
  const state = getState();
  const selectedElement = getSelectedElement(state);
  if (!selectedElement) throw Error();
  const style = {
    ...selectedElement.style,
    css,
  };
  return dispatch(updateStyle(style));
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
