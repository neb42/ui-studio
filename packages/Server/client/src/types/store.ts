import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Page, Layout, Widget } from '@ui-builder/types';

interface KeyedObject<T> {
  [key: string]: T;
}

export type Store$Element = {
  selectedElement: string | null;
  isAddElementModalOpen: boolean;
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
