export interface BaseComponentConfig {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  list: boolean;
}

export interface ComponentConfig$Input extends BaseComponentConfig {
  component: 'input';
}

export type ComponentConfig$Select = BaseComponentConfig & {
  component: 'select';
} & (
    | { type: 'string'; options: { key: string; label: string }[] }
    | { type: 'number'; options: { key: number; label: string }[] }
    | { type: 'boolean'; options: { key: boolean; label: string }[] }
    | { type: 'object'; options: { key: string; label: string }[] }
  );

export type ComponentConfig = ComponentConfig$Input | ComponentConfig$Select;

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
