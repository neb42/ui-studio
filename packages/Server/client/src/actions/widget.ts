import { Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { TStyle, Element, Widget } from '@ui-builder/types';
import { makeGetElement, makeGenerateDefaultName, makeGetNextPosition } from 'selectors/element';
import { TGetState, TThunkAction } from 'types/store';
import { selectElement, ISelectElement } from 'actions/element';

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
): TThunkAction<IAddWidget> => (
  dispatch: Dispatch<IAddWidget | ISelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const parentElement = makeGetElement()(state, parent);
  if (!parentElement) throw Error();
  const name = makeGenerateDefaultName()(
    state,
    component.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
  );
  const defaultStyle = getDefaultStyle(parentElement);
  const position = makeGetNextPosition()(state, parentElement.id);
  const widget: Widget = {
    id: uuidv4(),
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

  dispatch(selectElement(widget.id));

  return dispatch({
    type: ADD_WIDGET,
    payload: widget,
  });
};

interface IRemoveWidget {
  type: 'REMOVE_WIDGET';
  payload: string;
}

export const removeWidget = (id: string): IRemoveWidget => ({
  type: REMOVE_WIDGET,
  payload: id,
});

interface IUpdateWidgetProps {
  type: 'UPDATE_WIDGET_PROPS';
  payload: {
    id: string;
    key: string;
    mode: 'input' | 'function' | 'widget';
    value: any;
  };
}

export const updateWidgetProps = (
  id: string,
  key: string,
  mode: 'input' | 'function' | 'widget',
  value: any,
): IUpdateWidgetProps => ({
  type: UPDATE_WIDGET_PROPS,
  payload: {
    id,
    key,
    mode,
    value,
  },
});

interface IUpdateWidgetStyle {
  type: 'UPDATE_WIDGET_STYLE';
  payload: {
    id: string;
    style: TStyle;
  };
}

export const updateWidgetStyle = (id: string, style: TStyle): IUpdateWidgetStyle => ({
  type: UPDATE_WIDGET_STYLE,
  payload: {
    id,
    style,
  },
});

export type Action$Widget = IAddWidget | IRemoveWidget | IUpdateWidgetProps | IUpdateWidgetStyle;
