import { Action } from 'redux';
import { ThunkAction as TA } from 'redux-thunk';
import { Widget, Variable, Page, CustomComponent } from '@ui-studio/types';

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

export interface Store$Root {
  config: KeyedObject<Page | CustomComponent>;
}

export interface Store$Development {
  selectedElement: string | null;
  hoverElement: string | null;
}

export interface Store {
  root: Store$Root;
  widget: Store$Widget;
  variable: Store$Variable;
  development: Store$Development;
}

export type GetState = () => Store;

export type ThunkAction<ReturnType = void> = TA<ReturnType, Store, unknown, Action<string>>;
