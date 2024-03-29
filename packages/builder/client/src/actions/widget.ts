import { Dispatch } from 'redux';
import {
  Widget,
  WidgetProp,
  TStyle,
  CustomComponent,
  CustomComponentInstance,
} from '@ui-studio/types';
import { getNextPosition } from 'selectors/element';
import { getComponents } from 'selectors/configuration';
import { getSelectedRootId, getSelectedElementId } from 'selectors/view';
import { getElement, getRoots } from 'selectors/tree';
import { TGetState, TThunkAction } from 'types/store';
import { selectElement, SelectElement } from 'actions/view';
import { UpdateWidgetName } from 'actions/name';
import { UpdateStyle } from 'actions/styles';
import { InitClient } from 'actions/init';
import { AddWidgetEvent, UpdateWidgetEvent, RemoveWidgetEvent } from 'actions/event';
import { UpdateWidgetLayoutConfig, UpdateWidgetLayoutType } from 'actions/layout';
import {
  UpdateExposedPropertyKey,
  RemoveCustomComponentConfig,
  AddCustomComponent,
} from 'actions/customComponent';
import { AddPage } from 'actions/page';
import { WidgetModel } from 'models/widget';
import { StylesModel } from 'models/styles';
import { CustomComponentModel } from 'models/customComponent';

import { resetVariableFunctionArgsUsingWidget, resetWidgetPropsUsingWidget } from './foo';

export interface AddWidget {
  type: 'ADD_WIDGET';
  payload: {
    rootId: string;
    widget: Widget | CustomComponentInstance;
  };
}

export const ADD_WIDGET = 'ADD_WIDGET';

export const addWidget = (
  componentKey: string,
  library: string,
  parentElementId: string,
): TThunkAction<AddWidget> => (
  dispatch: Dispatch<AddWidget | SelectElement>,
  getState: TGetState,
) => {
  const state = getState();

  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();
  const parentElement = getElement(state, rootId, parentElementId);
  if (!parentElement) throw Error();

  const component = getComponents(state).find((c) => c.key === componentKey);
  if (!component) throw Error();

  const widget = WidgetModel.getDefaultWidget(state, component, library, parentElement);

  dispatch(selectElement(widget.id));

  return dispatch({
    type: ADD_WIDGET,
    payload: {
      rootId,
      widget,
    },
  });
};

export const addCustomComponentInstance = (
  customComponentId: string,
  parentElementId: string,
): TThunkAction<AddWidget> => (
  dispatch: Dispatch<AddWidget | SelectElement>,
  getState: TGetState,
) => {
  const state = getState();

  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();
  const parentElement = getElement(state, rootId, parentElementId);
  if (!parentElement) throw Error();

  const customComponent = getRoots(state)
    .filter((e): e is CustomComponent => e.type === 'customComponent')
    .find((c) => c.id === customComponentId);
  if (!customComponent) throw Error();

  const widget = CustomComponentModel.getDefaultCustomComponentInstance(
    state,
    customComponent,
    parentElement,
  );

  dispatch(selectElement(widget.id));

  return dispatch({
    type: ADD_WIDGET,
    payload: {
      rootId,
      widget,
    },
  });
};

export interface RemoveWidget {
  type: 'REMOVE_WIDGET';
  payload: {
    rootId: string;
    widgetId: string;
    parent: string;
    position: number;
    delete: boolean;
  };
}

export const REMOVE_WIDGET = 'REMOVE_WIDGET';

export const removeWidget = (
  widget: Widget | CustomComponentInstance,
  del = false,
): TThunkAction<RemoveWidget> => (
  dispatch: Dispatch<RemoveWidget | SelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();

  const selectedElementId = getSelectedElementId(state);
  if (selectedElementId === widget.id) {
    dispatch(selectElement(null));
  }

  dispatch(resetWidgetPropsUsingWidget(widget.id));
  dispatch(resetVariableFunctionArgsUsingWidget(widget.id));

  return dispatch({
    type: REMOVE_WIDGET,
    payload: {
      rootId,
      widgetId: widget.id,
      parent: widget.parent,
      position: widget.position,
      delete: del,
    },
  });
};

export interface UpdateWidgetProps {
  type: 'UPDATE_WIDGET_PROPS';
  payload: {
    rootId: string;
    widgetId: string;
    key: string;
    prop: WidgetProp;
  };
}

export const UPDATE_WIDGET_PROPS = 'UPDATE_WIDGET_PROPS';

export const updateWidgetProps = (
  key: string,
  prop: WidgetProp,
): TThunkAction<UpdateWidgetProps> => (
  dispatch: Dispatch<UpdateWidgetProps | SelectElement>,
  getState: TGetState,
) => {
  const state = getState();

  const rootId = getSelectedRootId(state);
  const widgetId = getSelectedElementId(state);
  if (!rootId || !widgetId) throw Error();

  return dispatch({
    type: UPDATE_WIDGET_PROPS,
    payload: {
      rootId,
      widgetId,
      key,
      prop,
    },
  });
};

export interface UpdateWidgetParent {
  type: 'UPDATE_WIDGET_PARENT';
  payload: {
    rootId: string;
    widgetId: string;
    parentId: string;
    position: number;
  };
}

export const UPDATE_WIDGET_PARENT = 'UPDATE_WIDGET_PARENT';

export const updateWidgetParent = (
  widgetId: string,
  parentId: string,
): TThunkAction<UpdateWidgetParent> => (
  dispatch: Dispatch<UpdateWidgetParent>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const position = getNextPosition(state, parentId);
  if (!rootId || !widgetId) throw Error();
  return dispatch({
    type: UPDATE_WIDGET_PARENT,
    payload: {
      rootId,
      widgetId,
      parentId,
      position,
    },
  });
};

export interface UpdateWidgetPosition {
  type: 'UPDATE_WIDGET_POSITION';
  payload: {
    rootId: string;
    widgetId: string;
    source: {
      parentId: string;
      position: number;
    };
    destination: {
      parentId: string;
      position: number;
    };
    style: TStyle;
  };
}

export const UPDATE_WIDGET_POSITION = 'UPDATE_WIDGET_POSITION';

export const updateWidgetPosition = (
  widgetId: string,
  source: { parentId: string; position: number },
  destination: { parentId: string; position: number },
): TThunkAction<UpdateWidgetPosition> => (
  dispatch: Dispatch<UpdateWidgetPosition>,
  getState: TGetState,
) => {
  const state = getState();

  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();

  const element = getElement(state, rootId, widgetId);
  const sourceElement = getElement(state, rootId, source.parentId);
  const destinationElement = getElement(state, rootId, destination.parentId);

  if (!element || !sourceElement || !destinationElement) throw Error();

  const sourceDefaultStyle = StylesModel.getDefaultStyle(sourceElement);
  const destinationDefaultStyle = StylesModel.getDefaultStyle(destinationElement);
  const style: TStyle =
    sourceDefaultStyle.type === destinationDefaultStyle.type
      ? element.style
      : {
          ...destinationDefaultStyle,
          css: element.style.css,
          classNames: element.style.classNames,
        };

  return dispatch({
    type: UPDATE_WIDGET_POSITION,
    payload: {
      rootId,
      widgetId,
      source,
      destination,
      style,
    },
  });
};

export type Action$Widget =
  | AddWidget
  | RemoveWidget
  | UpdateWidgetProps
  | UpdateWidgetParent
  | UpdateWidgetPosition
  | AddWidgetEvent
  | UpdateWidgetEvent
  | RemoveWidgetEvent
  | UpdateWidgetName
  | UpdateStyle
  | UpdateWidgetLayoutConfig
  | UpdateWidgetLayoutType
  | InitClient
  | UpdateExposedPropertyKey
  | RemoveCustomComponentConfig
  | AddPage
  | AddCustomComponent;
