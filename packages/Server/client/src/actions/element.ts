import { InitFunctions, Component } from '@ui-builder/types';
import { Store$Page, Store$Widget, Store$Layout, Store$Variable } from 'types/store';

export const UPDATE_ELEMENT_NAME = 'UPDATE_ELEMENT_NAME';
export const UPDATE_ELEMENT_CSS = 'UPDATE_ELEMENT_CSS';
export const UPDATE_ELEMENT_CLASS_NAMES = 'UPDATE_ELEMENT_CLASS_NAMES';
export const SELECT_PAGE = 'SELECT_PAGE';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';
export const SELECT_VIEW = 'SELECT_VIEW';
export const INIT_FUNCTIONS = 'INIT_FUNCTIONS';
export const INIT_COMPONENTS = 'INIT_COMPONENTS';

export interface IUpdateElementName {
  type: 'UPDATE_ELEMENT_NAME';
  payload: {
    id: string;
    type: 'widget' | 'layout' | 'page' | 'overlay';
    name: string;
  };
}

export const updateElementName = (
  id: string,
  type: 'widget' | 'layout' | 'page' | 'overlay',
  name: string,
): IUpdateElementName => {
  return {
    type: UPDATE_ELEMENT_NAME,
    payload: {
      id,
      name,
      type,
    },
  };
};

export interface UpdateElementCSS {
  type: 'UPDATE_ELEMENT_CSS';
  payload: {
    id: string;
    css: string;
  };
}

export const updateElementCSS = (id: string, css: string): UpdateElementCSS => {
  return {
    type: UPDATE_ELEMENT_CSS,
    payload: {
      id,
      css,
    },
  };
};

export interface UpdateElementClassNames {
  type: 'UPDATE_ELEMENT_CLASS_NAMES';
  payload: {
    id: string;
    classNames: string;
  };
}

export const updateElementClassNames = (
  id: string,
  classNames: string,
): UpdateElementClassNames => {
  return {
    type: UPDATE_ELEMENT_CLASS_NAMES,
    payload: {
      id,
      classNames,
    },
  };
};

export interface ISelectPage {
  type: 'SELECT_PAGE';
  payload: string;
}

export const selectPage = (id: string): ISelectPage => ({
  type: SELECT_PAGE,
  payload: id,
});

export interface ISelectElement {
  type: 'SELECT_ELEMENT';
  payload: string | null;
}

export const selectElement = (id: string | null): ISelectElement => ({
  type: SELECT_ELEMENT,
  payload: id,
});

export interface HoverElement {
  type: 'HOVER_ELEMENT';
  payload: string | null;
}

export const HOVER_ELEMENT = 'HOVER_ELEMENT';

export const hoverElement = (id: string | null): HoverElement => ({
  type: HOVER_ELEMENT,
  payload: id,
});

export interface SelectView {
  type: 'SELECT_VIEW';
  payload: 'preview' | 'variable' | 'css';
}

export const selectView = (view: 'preview' | 'variable' | 'css'): SelectView => ({
  type: SELECT_VIEW,
  payload: view,
});

interface IInitFunctions {
  type: 'INIT_FUNCTIONS';
  payload: InitFunctions;
}

export const initFunctions = (functions: InitFunctions): IInitFunctions => ({
  type: INIT_FUNCTIONS,
  payload: functions,
});

interface IInitComponents {
  type: 'INIT_COMPONENTS';
  payload: Component[];
}

export const initComponents = (components: Component[]): IInitComponents => ({
  type: INIT_COMPONENTS,
  payload: components,
});

export interface InitClient {
  type: 'INIT_CLIENT';
  payload: {
    pages: Store$Page;
    layouts: Store$Layout;
    widgets: Store$Widget;
    variables: Store$Variable;
  };
}

export const INIT_CLIENT = 'INIT_CLIENT';

export const initClient = (client: {
  pages: Store$Page;
  layouts: Store$Layout;
  widgets: Store$Widget;
  variables: Store$Variable;
}): InitClient => ({
  type: INIT_CLIENT,
  payload: client,
});

export interface UpdateElementPosition {
  type: 'UPDATE_ELEMENT_POSITION';
  payload: {
    elementId: string;
    source: {
      parentId: string;
      position: number;
    };
    destination: {
      parentId: string;
      position: number;
    };
  };
}

export const UPDATE_ELEMENT_POSITION = 'UPDATE_ELEMENT_POSITION';

export const updateElementPosition = (
  elementId: string,
  source: { parentId: string; position: number },
  destination: { parentId: string; position: number },
): UpdateElementPosition => ({
  type: UPDATE_ELEMENT_POSITION,
  payload: {
    elementId,
    source,
    destination,
  },
});

export type Action$Element =
  | ISelectPage
  | ISelectElement
  | HoverElement
  | SelectView
  | IUpdateElementName
  | IInitFunctions
  | IInitComponents
  | InitClient;
