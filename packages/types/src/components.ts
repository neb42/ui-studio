import { OpenAPIV3 } from 'openapi-types';

export type ComponentConfig = {
  key: string;
  label: string;
  defaultValue: any;
  iterable?: boolean;
  schema: OpenAPIV3.SchemaObject;
};

export type Component$Event = {
  key: string;
  label: string;
};

export type ExposedProperty = {
  property: string;
  schema: OpenAPIV3.SchemaObject;
};

export interface Component {
  key: string;
  name: string;
  category: string;
  library: string;
  icon: string;
  hasChildren?: boolean;
  hasLayout?: boolean;
  exposedProperties?: ExposedProperty[];
  events?: Component$Event[];
  config?: ComponentConfig[];
}
