import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  Page,
  Layout,
  Widget,
  FunctionDefinition,
  ActionDefinition,
  IOverlay,
  Variable,
  Component,
} from 'canvas-types';

export interface KeyedObject<T> {
  [key: string]: T;
}

export type Store$Element = {
  selectedPage: string | null;
  selectedOverlay: string | null;
  selectedElement: string | null;
  hoverElement: string | null;
  selectedVariable: string | null;
  selectedView: 'preview' | 'variable' | 'css';
  functions: FunctionDefinition[];
  actions: ActionDefinition[];
  components: Component[];
};
export type Store$Page = KeyedObject<Page>;
export type Store$Overlay = KeyedObject<IOverlay>;
export type Store$Layout = KeyedObject<Layout>;
export type Store$Widget = KeyedObject<Widget>;
export type Store$Variable = KeyedObject<Variable>;

export interface Store {
  element: Store$Element;
  page: Store$Page;
  overlay: Store$Overlay;
  layout: Store$Layout;
  widget: Store$Widget;
  variable: Store$Variable;
}

export type TGetState = () => Store;

export type TThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  Store,
  unknown,
  Action<string>
>;
