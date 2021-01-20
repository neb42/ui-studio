import { InitFunctions, Component } from '@ui-builder/types';

export const UPDATE_ELEMENT_NAME = 'UPDATE_ELEMENT_NAME';
export const UPDATE_ELEMENT_CSS = 'UPDATE_ELEMENT_CSS';
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

export const updateElementCSS= (
  id: string,
  css: string,
): UpdateElementCSS => {
  return {
    type: UPDATE_ELEMENT_CSS,
    payload: {
      id,
      css,
    },
  };
};

interface ISelectPage {
  type: 'SELECT_PAGE';
  payload: string;
}

export const selectPage = (id: string): ISelectPage => ({
  type: SELECT_PAGE,
  payload: id,
});

export interface ISelectElement {
  type: 'SELECT_ELEMENT';
  payload: string;
}

export const selectElement = (id: string): ISelectElement => ({
  type: SELECT_ELEMENT,
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
  payload: InitFunctions[];
}

export const initFunctions = (functions: InitFunctions[]): IInitFunctions => ({
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

export type Action$Element =
  | ISelectPage
  | ISelectElement
  | SelectView
  | IUpdateElementName
  | IInitFunctions
  | IInitComponents;
