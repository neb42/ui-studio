import { Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { TStyle, IGridCell, Element, Layout } from 'canvas-types';
import { makeGetElement, makeGenerateDefaultName, makeGetNextPosition } from 'selectors/element';
import { TGetState, TThunkAction } from 'types/store';
import { selectElement, ISelectElement } from 'actions/element';

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
          classNames: '',
          layout: [
            [0, 0],
            [0, 0],
          ],
          rowAlignment: 'stretch',
          columnAlignment: 'stretch',
        };
      }
      if (parent.layoutType === 'flex') {
        return {
          type: 'flex',
          align: 'auto',
          justify: 'auto',
          grow: 0,
          css: '',
          classNames: '',
        };
      }
    }
    if (parent.type === 'page') {
      return {
        type: 'page',
        css: '',
        classNames: '',
      };
    }
    return { type: 'base', css: '', classNames: '' };
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
        columnGap: 0,
        rowGap: 0,
        rowAlignment: 'stretch' as const,
        columnAlignment: 'stretch' as const,
      },
    };
  }
  if (layoutType === 'flex') {
    return {
      layoutType,
      props: {
        direction: 'row' as const,
        align: 'flex-start' as const,
        justify: 'flex-start' as const,
        wrap: false,
      },
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
): TThunkAction<IAddLayout> => (
  dispatch: Dispatch<IAddLayout | ISelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const parentElement = makeGetElement()(state, parent);
  if (!parentElement) throw Error();
  const name = makeGenerateDefaultName()(
    state,
    layoutType.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
  );
  const defaultConfig = getDefaultConfig(layoutType);
  const defaultStyle = getDefaultStyle(parentElement);
  const position = makeGetNextPosition()(state, parentElement.id);
  const layout: Layout = {
    id: uuidv4(),
    type: 'layout',
    name,
    parent,
    position,
    style: defaultStyle,
    ...defaultConfig,
  };

  dispatch(selectElement(layout.id));

  return dispatch({
    type: ADD_LAYOUT,
    payload: layout,
  });
};

export interface IRemoveLayout {
  type: 'REMOVE_LAYOUT';
  payload: {
    id: string;
    parent: string;
    position: number;
    delete: boolean;
  };
}

export const removeLayout = (layout: Layout, del = false): IRemoveLayout => ({
  type: REMOVE_LAYOUT,
  payload: {
    id: layout.id,
    parent: layout.parent,
    position: layout.position,
    delete: del,
  },
});

interface IUpdateLayoutConfig {
  type: 'UPDATE_LAYOUT_CONFIG';
  payload: {
    id: string;
    key: string;
    value: any;
  };
}

export const updateLayoutConfig = (id: string, key: string, value: any): IUpdateLayoutConfig => ({
  type: UPDATE_LAYOUT_CONFIG,
  payload: {
    id,
    key,
    value,
  },
});

interface IUpdateLayoutStyle {
  type: 'UPDATE_LAYOUT_STYLE';
  payload: {
    id: string;
    style: TStyle;
  };
}

export const updateLayoutStyle = (id: string, style: TStyle): IUpdateLayoutStyle => ({
  type: UPDATE_LAYOUT_STYLE,
  payload: {
    id,
    style,
  },
});

export type Action$Layout = IAddLayout | IRemoveLayout | IUpdateLayoutConfig | IUpdateLayoutStyle;
