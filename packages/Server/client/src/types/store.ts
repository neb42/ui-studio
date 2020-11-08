import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Page, Layout, Widget, TInitFunctions } from '@ui-builder/types';

interface KeyedObject<T> {
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
  options: any[];
}

export type TComponentConfig = IComponentConfig$Input | IComponentConfig$Select;

export interface IComponent {
  name: string;
  description: string;
  library: string;
  config: TComponentConfig[];
}

export type Store$Element = {
  selectedElement: string | null;
  isAddElementModalOpen: boolean;
  functions: TInitFunctions;
  components: IComponent[];
};
export type Store$Page = KeyedObject<Page>;
export type Store$Layout = KeyedObject<Layout>;
export type Store$Widget = KeyedObject<Widget>;

export interface Store {
  element: Store$Element;
  page: Store$Page;
  layout: Store$Layout;
  widget: Store$Widget;
}

export type TGetState = () => Store;

export type TThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  Store,
  unknown,
  Action<string>
>;
