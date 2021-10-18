import * as React from 'react';
import { useDispatch } from 'react-redux';
import { CustomComponent, ComponentConfig } from '@ui-studio/types';
import {
  addCustomComponentConfig,
  updateCustomComponentConfig,
  removeCustomComponentConfig,
} from 'actions/customComponent';
import { OpenAPIV3 } from 'openapi-types';

import { CustomComponentConfigComponent } from './CustomComponentConfig.component';

type Props = {
  customComponent: CustomComponent;
};

const getDefaultDefaultValue = (
  mode: 'input' | 'select',
  type: OpenAPIV3.SchemaObject['type'],
  options?: any[],
) => {
  if (mode === 'input') {
    if (type === 'string') return '';
    if (type === 'number' || type === 'integer') return 0;
    if (type === 'boolean') return true;
  }
  if (mode === 'select') return options?.[0] ?? null;
  throw Error();
};

export const CustomComponentConfigContainer = ({ customComponent }: Props): JSX.Element => {
  const dispatch = useDispatch();

  const getConfigItem = (key: string) => {
    const configItem = customComponent.config?.find((c) => c.key === key);
    if (!configItem) throw Error();
    if (configItem.schema.type === 'object') throw Error();
    return configItem;
  };

  const handleAddConfig = () => dispatch(addCustomComponentConfig());

  const handleRemoveConfig = (key: string) => dispatch(removeCustomComponentConfig(key));

  const handleUpdateName = (key: string, name: string) => {
    const configItem = getConfigItem(key);
    dispatch(
      updateCustomComponentConfig(key, {
        ...configItem,
        label: name,
      }),
    );
  };

  const handleUpdateMode = (key: string, mode: 'input' | 'select') => {
    const configItem = getConfigItem(key);
    const config: ComponentConfig = (() => {
      if (mode === 'input') {
        const defaultValue = getDefaultDefaultValue(mode, configItem.schema.type);
        const s = (() => {
          if (configItem.schema.type === 'array') {
            if ('ref' in configItem.schema.items) throw new Error();
            return {
              type: 'array' as const,
              items: { type: (configItem.schema.items as OpenAPIV3.NonArraySchemaObject).type },
            };
          }
          return { type: configItem.schema.type };
        })();
        return {
          ...configItem,
          component: mode,
          defaultValue,
          schema: s,
        };
      }
      if (mode === 'select') {
        const options = (() => {
          if (configItem.schema.type === 'boolean') {
            return [
              { label: 'True', key: true },
              { label: 'False', key: false },
            ];
          }
          return [];
        })();
        const defaultValue = getDefaultDefaultValue(mode, configItem.schema.type, options);
        const s: OpenAPIV3.SchemaObject = (() => {
          if (configItem.schema.type === 'array') {
            if ('ref' in configItem.schema.items) throw new Error();
            return {
              type: 'array' as const,
              items: {
                type: (configItem.schema.items as OpenAPIV3.NonArraySchemaObject).type,
                enum: options.map((o) => o.key),
              },
            };
          }
          return {
            type: configItem.schema.type,
            enum: options.map((o) => o.key),
          };
        })();
        return {
          ...configItem,
          defaultValue,
          schema: s,
        };
      }
      throw Error();
    })();
    dispatch(updateCustomComponentConfig(key, config));
  };

  const handleUpdateType = (key: string, type: 'string' | 'number' | 'boolean') => {
    const configItem = getConfigItem(key);
    const control = (() => {
      if (configItem.schema.type === 'array') {
        return 'enum' in (configItem.schema as OpenAPIV3.ArraySchemaObject).items
          ? 'select'
          : 'input';
      }
      return 'enum' in configItem.schema ? 'select' : 'input';
    })();

    const config: ComponentConfig = (() => {
      if (control === 'input') {
        const defaultValue = getDefaultDefaultValue(control, type);
        return {
          ...configItem,
          type,
          defaultValue,
          schema:
            configItem.schema.type === 'array'
              ? {
                  type: 'array' as const,
                  items: { type },
                }
              : { type },
        };
      }
      if (control === 'select') {
        const options = (() => {
          if (type === 'boolean') {
            return [
              { label: 'True', key: true },
              { label: 'False', key: false },
            ];
          }
          return [];
        })();
        const defaultValue = getDefaultDefaultValue(control, type, options);
        return {
          ...configItem,
          defaultValue,
          options,
          schema:
            configItem.schema.type === 'array'
              ? {
                  type: 'array' as const,
                  items: { type, enum: options.map((o) => o.key) },
                }
              : {
                  type,
                  enum: options.map((o) => o.key),
                },
        };
      }
      throw Error();
    })();

    dispatch(updateCustomComponentConfig(key, config as ComponentConfig));
  };

  const handleUpdateList = (key: string, value: boolean) => {
    const configItem = getConfigItem(key);
    const schema = value
      ? {
          type: 'array' as const,
          items: configItem.schema,
        }
      : ((configItem.schema as OpenAPIV3.ArraySchemaObject).items as OpenAPIV3.SchemaObject);
    dispatch(
      updateCustomComponentConfig(key, {
        ...configItem,
        schema,
      }),
    );
  };

  const handleUpdateIterable = (key: string, value: boolean) => {
    const configItem = getConfigItem(key);
    const s = configItem.schema.type === 'array' ? configItem.schema.items : configItem.schema;
    dispatch(
      updateCustomComponentConfig(key, {
        ...configItem,
        iterable: value,
        schema: value
          ? {
              type: 'array',
              items: s,
            }
          : s,
      } as ComponentConfig),
    );
  };

  const handleUpdateDefaultValue = (key: string, value: any) => {
    const configItem = getConfigItem(key);
    dispatch(
      updateCustomComponentConfig(key, {
        ...configItem,
        defaultValue: value,
      } as ComponentConfig),
    );
  };

  const handleUpdateSelectOptions = (
    key: string,
    options: { key: string | number | boolean; label: string }[],
  ) => {
    const configItem = getConfigItem(key);
    dispatch(
      updateCustomComponentConfig(key, {
        ...configItem,
        schema:
          configItem.schema.type === 'array'
            ? {
                ...configItem.schema,
                items: { ...configItem.schema.items, enum: options.map((o) => o.key) },
              }
            : { ...configItem.schema, enum: options.map((o) => o.key) },
      } as ComponentConfig),
    );
  };

  return (
    <CustomComponentConfigComponent
      config={customComponent.config || []}
      onAddConfig={handleAddConfig}
      onRemoveConfig={handleRemoveConfig}
      onUpdateName={handleUpdateName}
      onUpdateMode={handleUpdateMode}
      onUpdateType={handleUpdateType}
      onUpdateList={handleUpdateList}
      onUpdateIterable={handleUpdateIterable}
      onUpdateDefaultValue={handleUpdateDefaultValue}
      onUpdateSelectOptions={handleUpdateSelectOptions}
    />
  );
};
