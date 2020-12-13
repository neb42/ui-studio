import { Dispatch } from 'redux';
import { TStyle, Element, Widget } from '@ui-builder/types';
import { makeGetElement, makeGenerateDefaultName, makeGetNextPosition } from 'selectors/element';
import { TGetState, TThunkAction } from 'types/store';

export const ADD_WIDGET = 'ADD_WIDGET';
export const REMOVE_WIDGET = 'REMOVE_WIDGET';
export const UPDATE_WIDGET_PROPS = 'UPDATE_WIDGET_PROPS';
export const UPDATE_WIDGET_STYLE = 'UPDATE_WIDGET_STYLE';

const getDefaultStyle = (parent: Element | null): TStyle => {
  if (parent) {
    if (parent.type === 'layout') {
      if (parent.layoutType === 'grid') {
        return {
          type: 'grid',
          css: '',
          layout: [
            [0, 0],
            [0, 0],
          ],
        };
      }
      if (parent.layoutType === 'flex') {
        return {
          type: 'flex',
          css: '',
        };
      }
    }
    if (parent.type === 'page') {
      return {
        type: 'page',
        css: '',
      };
    }
  }
  throw Error();
};

interface IAddWidget {
  type: 'ADD_WIDGET';
  payload: Widget;
}

export const addWidget = (
  component: string,
  library: string,
  parent: string,
): TThunkAction<IAddWidget> => (dispatch: Dispatch<IAddWidget>, getState: TGetState) => {
  const state = getState();
  const parentElement = makeGetElement()(state, parent);
  if (!parentElement) throw Error();
  const name = makeGenerateDefaultName()(
    state,
    component.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
  );
  const defaultStyle = getDefaultStyle(parentElement);
  const position = makeGetNextPosition()(state, parentElement.name);
  const widget: Widget = {
    id: '',
    type: 'widget',
    name,
    component,
    library,
    parent,
    position,
    props: {},
    style: defaultStyle,
    dependencies: {
      queries: [],
      serverFunctions: [],
      clientFunctions: [],
      widgets: [],
    },
  };
  return dispatch({
    type: ADD_WIDGET,
    payload: widget,
  });
};

interface IRemoveWidget {
  type: 'REMOVE_WIDGET';
  payload: string;
}

export const removeWidget = (name: string): IRemoveWidget => ({
  type: REMOVE_WIDGET,
  payload: name,
});

interface IUpdateWidgetProps {
  type: 'UPDATE_WIDGET_PROPS';
  payload: {
    name: string;
    key: string;
    mode: 'input' | 'function' | 'widget';
    value: any;
  };
}

export const updateWidgetProps = (
  name: string,
  key: string,
  mode: 'input' | 'function' | 'widget',
  value: any,
): IUpdateWidgetProps => ({
  type: UPDATE_WIDGET_PROPS,
  payload: {
    name,
    key,
    mode,
    value,
  },
});

interface IUpdateWidgetStyle {
  type: 'UPDATE_WIDGET_STYLE';
  payload: {
    name: string;
    style: TStyle;
  };
}

export const updateWidgetStyle = (name: string, style: TStyle): IUpdateWidgetStyle => ({
  type: UPDATE_WIDGET_STYLE,
  payload: {
    name,
    style,
  },
});

export type Action$Widget = IAddWidget | IRemoveWidget | IUpdateWidgetProps | IUpdateWidgetStyle;
