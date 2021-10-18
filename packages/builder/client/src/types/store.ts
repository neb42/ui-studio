import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { OpenAPIV3 } from 'openapi-types';
import {
  Page,
  Widget,
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
  modal: {
    functionConfiguration:
      | {
          open: true;
          type: 'function';
          id: string;
          path: string;
          method: OpenAPIV3.HttpMethods;
        }
      | {
          open: true;
          type: 'action';
          // pageId, widgetId, eventKey, eventInstanceIndex
          id: [string, string, string, number];
          path: string;
          method: OpenAPIV3.HttpMethods;
        }
      | {
          open: false;
          type: null;
          id: null;
          path: null;
          method: null;
        };
  };
};

export type Store$Configuration = {
  openAPISchema: OpenAPIV3.Document;
  functions: { path: string; method: OpenAPIV3.HttpMethods }[];
  actions: { path: string; method: OpenAPIV3.HttpMethods }[];
  components: Component[];
  colors:
    | {
        type: 'swatch';
        colors: string[][];
      }
    | {
        type: 'block';
        colors: string[];
      }
    | null;
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
