import { TInitFunctions } from '@ui-builder/types';
import { IComponent } from 'types/store';

export const UPDATE_ELEMENT_NAME = 'UPDATE_ELEMENT_NAME';
export const SELECT_PAGE = 'SELECT_PAGE';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';
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

interface IInitFunctions {
  type: 'INIT_FUNCTIONS';
  payload: TInitFunctions;
}

export const initFunctions = (functions: TInitFunctions): IInitFunctions => ({
  type: INIT_FUNCTIONS,
  payload: functions,
});

interface IInitComponents {
  type: 'INIT_COMPONENTS';
  payload: IComponent[];
}

export const initComponents = (components: IComponent[]): IInitComponents => ({
  type: INIT_COMPONENTS,
  payload: components,
});

export type Action$Element =
  | ISelectPage
  | ISelectElement
  | IUpdateElementName
  | IInitFunctions
  | IInitComponents;
