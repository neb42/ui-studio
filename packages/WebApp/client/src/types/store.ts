import { Page, Layout, Widget } from './element';

interface KeyedObject<T> {
  [key: string]: T;
}

export type Store$Element$Page = KeyedObject<Page>;
export type Store$Element$Layout = KeyedObject<Layout>;
export type Store$Element$Widget = KeyedObject<Widget>;

export interface Store$Element {
  selectedElement: string | null;
  page: Store$Element$Page;
  layout: Store$Element$Layout;
  widget: Store$Element$Widget;
}

export interface Store {
  element: Store$Element;
}
