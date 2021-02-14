export interface BaseComponentConfig {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'object';
}

export interface ComponentConfig$Radio {
  component: 'radio';
  key: string;
  label: string;
  labels: string[];
  options: ComponentConfig[];
}

export interface ComponentConfig$List {
  component: 'list';
  key: string;
  label: string;
  options: ComponentConfig[];
}

export interface ComponentConfig$Input extends BaseComponentConfig {
  component: 'input';
}

export interface ComponentConfig$Select extends BaseComponentConfig {
  component: 'select';
  options: { key: string; label: string }[];
}

export type ComponentConfig =
  | ComponentConfig$Input
  | ComponentConfig$Select
  | ComponentConfig$Radio
  | ComponentConfig$List;

export type Component$Event = {
  key: string;
  label: string;
};

export interface Component {
  name: string;
  description: string;
  category: string;
  library: string;
  icon: string;
  hasChildren: boolean;
  exposedProperties: string[];
  events: Component$Event[];
  config: ComponentConfig[];
}
