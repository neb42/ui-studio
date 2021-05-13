import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  Page,
  Widget,
  FunctionDefinition,
  ActionDefinition,
  Variable,
  Component,
  CustomComponent,
  CustomComponentInstance,
} from '@ui-studio/types';

export interface KeyedObject<T> {
  [key: string]: T;
}

export type ScreenSize = 'monitor' | 'laptop' | 'tablet' | 'mobile';

export type Store$Variable = KeyedObject<Variable>;

export type Store$Tree = KeyedObject<{
  root: Page | CustomComponent;
  widgets: KeyedObject<Widget | CustomComponentInstance>;
}>;

export type Store$Page = KeyedObject<Page>;

export type Store$CustomComponent = KeyedObject<CustomComponent>;

export type Store$Widget = KeyedObject<KeyedObject<Widget | CustomComponentInstance>>;

export type Store$View = {
  tree: {
    rootId: string | null;
    selectedElementId: string | null;
    hoverElementId: string | null;
  };
  variable: {
    selectedVariableId: string | null;
  };
  preview: {
    size: ScreenSize;
  };
  selectedView: 'preview' | 'variable' | 'css';
};

export type Store$Configuration = {
  functions: FunctionDefinition[];
  actions: ActionDefinition[];
  components: Component[];
};

export interface Store {
  page: Store$Page;
  customComponent: Store$CustomComponent;
  widget: Store$Widget;
  view: Store$View;
  configuration: Store$Configuration;
  variable: Store$Variable;
}

export type TGetState = () => Store;

export type TThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  Store,
  unknown,
  Action<string>
>;
