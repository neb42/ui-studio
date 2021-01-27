import { Action } from 'redux';
import { ThunkAction as TA } from 'redux-thunk';
import { Widget, Variable, Page, Layout } from '@ui-builder/types';

export interface KeyedObject<T> {
  [key: string]: T;
}

export interface Store$Widget {
  config: KeyedObject<Widget>;
  value: KeyedObject<KeyedObject<any>>;
}

export interface Store$Variable {
  config: KeyedObject<Variable>;
  value: KeyedObject<KeyedObject<any>>;
}

export interface Store$Page {
  config: KeyedObject<Page>;
}

export interface Store$Layout {
  config: KeyedObject<Layout>;
}

export interface Store {
  widget: Store$Widget;
  variable: Store$Variable;
  page: Store$Page;
  layout: Store$Layout;
}

export type GetState = () => Store;

export type ThunkAction<ReturnType = void> = TA<ReturnType, Store, unknown, Action<string>>;
