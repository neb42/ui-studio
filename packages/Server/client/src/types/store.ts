import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Page, Layout, Widget, InitFunctions, IOverlay, Variable } from '@ui-builder/types';

export interface KeyedObject<T> {
  [key: string]: T;
}

export interface IComponentConfig$Input {
  component: 'input';
  key: string;
  label: string;
}

export interface IComponentConfig$Select {
  component: 'select';
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export type TComponentConfig = IComponentConfig$Input | IComponentConfig$Select;

export interface IComponent {
  name: string;
  description: string;
  category: string;
  library: string;
  icon: string;
  config: TComponentConfig[];
}

export type Store$Element = {
  selectedPage: string | null;
  selectedOverlay: string | null;
  selectedElement: string | null;
  selectedVariable: string | null;
  functions: InitFunctions[];
  components: IComponent[];
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
