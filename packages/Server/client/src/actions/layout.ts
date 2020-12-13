import { Dispatch } from 'redux';
import { TStyle, IGridCell, Element, Layout } from '@ui-builder/types';
import { makeGetElement, makeGenerateDefaultName, makeGetNextPosition } from 'selectors/element';
import { TGetState, TThunkAction } from 'types/store';

export const ADD_LAYOUT = 'ADD_LAYOUT';
export const REMOVE_LAYOUT = 'REMOVE_LAYOUT';
export const UPDATE_LAYOUT_CONFIG = 'UPDATE_LAYOUT_CONFIG';
export const UPDATE_LAYOUT_STYLE = 'UPDATE_LAYOUT_STYLE';

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

const defaultCell: IGridCell = { value: 1, unit: 'fr' };
const getDefaultConfig = (layoutType: 'grid' | 'flex') => {
  if (layoutType === 'grid') {
    return {
      layoutType,
      props: {
        rows: [defaultCell],
        columns: [defaultCell],
      },
    };
  }
  if (layoutType === 'flex') {
    return {
      layoutType,
      props: {},
    };
  }
  throw Error();
};

interface IAddLayout {
  type: 'ADD_LAYOUT';
  payload: Layout;
}

export const addLayout = (
  layoutType: 'grid' | 'flex',
  parent: string,
): TThunkAction<IAddLayout> => (dispatch: Dispatch<IAddLayout>, getState: TGetState) => {
  const state = getState();
  const parentElement = makeGetElement()(state, parent);
  if (!parentElement) throw Error();
  const name = makeGenerateDefaultName()(
    state,
    layoutType.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
  );
  const defaultConfig = getDefaultConfig(layoutType);
  const defaultStyle = getDefaultStyle(parentElement);
  const position = makeGetNextPosition()(state, parentElement.name);
  const layout: Layout = {
    id: '',
    type: 'layout',
    name,
    parent,
    position,
    style: defaultStyle,
    ...defaultConfig,
  };
  return dispatch({
    type: ADD_LAYOUT,
    payload: layout,
  });
};

export interface IRemoveLayout {
  type: 'REMOVE_LAYOUT';
  payload: string;
}

export const removeLayout = (name: string): IRemoveLayout => ({
  type: REMOVE_LAYOUT,
  payload: name,
});

interface IUpdateLayoutConfig {
  type: 'UPDATE_LAYOUT_CONFIG';
  payload: {
    name: string;
    key: string;
    value: any;
  };
}

export const updateLayoutConfig = (name: string, key: string, value: any): IUpdateLayoutConfig => ({
  type: UPDATE_LAYOUT_CONFIG,
  payload: {
    name,
    key,
    value,
  },
});

interface IUpdateLayoutStyle {
  type: 'UPDATE_LAYOUT_STYLE';
  payload: {
    name: string;
    style: TStyle;
  };
}

export const updateLayoutStyle = (name: string, style: TStyle): IUpdateLayoutStyle => ({
  type: UPDATE_LAYOUT_STYLE,
  payload: {
    name,
    style,
  },
});

export type Action$Layout = IAddLayout | IRemoveLayout | IUpdateLayoutConfig | IUpdateLayoutStyle;
