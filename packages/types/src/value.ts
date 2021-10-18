export type Value$Static = {
  mode: 'static';
} & ({ value: string } | { value: number } | { value: boolean } | { value: string });

export type Value$Variable = {
  mode: 'variable';
} & {
  variableId: string;
  lookup?: string;
};

export type Value$Widget = {
  mode: 'widget';
  widgetId: string;
  property: string;
};

export type Value$Iterable = {
  mode: 'iterable';
  widgetId: string;
  propKey: string;
  lookup: string;
};

export type Value$CustomComponentConfig = {
  mode: 'customComponentConfig';
  configKey: string;
};

export type Value$List = {
  mode: 'list';
  props: (Value$Static | Value$Complex)[];
};

export type Value$Complex = {
  mode: 'complex';
  props: {
    [key: string]: Value$Static;
    // [key: string]: Value$Static | Value$Variable | Value$Widget | Value$CustomComponentConfig;
  };
};

export type Value =
  | Value$Widget
  | Value$Static
  | Value$Variable
  | Value$List
  | Value$Complex
  | Value$Iterable
  | Value$CustomComponentConfig;
