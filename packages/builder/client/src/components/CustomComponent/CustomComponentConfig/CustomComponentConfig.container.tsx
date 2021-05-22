import * as React from 'react';
import { useDispatch } from 'react-redux';
import { CustomComponent, ComponentConfig, ComponentConfig$Select } from '@ui-studio/types';
import {
  addCustomComponentConfig,
  updateCustomComponentConfig,
  removeCustomComponentConfig,
} from 'actions/customComponent';

import { CustomComponentConfigComponent } from './CustomComponentConfig.component';

type Props = {
  customComponent: CustomComponent;
};

const getDefaultDefaultValue = (
  mode: 'input' | 'select',
  type: 'string' | 'number' | 'boolean' | 'object',
  options?: any[],
) => {
  if (mode === 'input') {
    if (type === 'string') return '';
    if (type === 'number') return 0;
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
    if (configItem.component === 'complex') throw Error();
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
    const config = (() => {
      if (mode === 'input') {
        const defaultValue = getDefaultDefaultValue(mode, configItem.type);
        return {
          ...configItem,
          component: mode,
          defaultValue,
        };
      }
      if (mode === 'select') {
        const options = (() => {
          if (configItem.type === 'boolean') {
            return [
              { label: 'True', key: true },
              { label: 'False', key: false },
            ];
          }
          return [];
        })();
        const defaultValue = getDefaultDefaultValue(mode, configItem.type, options);
        return {
          ...configItem,
          component: mode,
          defaultValue,
          options,
        };
      }
      throw Error();
    })();
    dispatch(updateCustomComponentConfig(key, config as ComponentConfig));
  };

  const handleUpdateType = (key: string, type: 'string' | 'number' | 'boolean') => {
    const configItem = getConfigItem(key);
    const config = (() => {
      if (configItem.component === 'input') {
        const defaultValue = getDefaultDefaultValue(configItem.component, type);
        return {
          ...configItem,
          type,
          defaultValue,
        };
      }
      if (configItem.component === 'select') {
        const options = (() => {
          if (type === 'boolean') {
            return [
              { label: 'True', key: true },
              { label: 'False', key: false },
            ];
          }
          return [];
        })();
        const defaultValue = getDefaultDefaultValue(configItem.component, type, options);
        return {
          ...configItem,
          type,
          defaultValue,
          options,
        };
      }
      throw Error();
    })();
    dispatch(updateCustomComponentConfig(key, config as ComponentConfig));
  };

  const handleUpdateList = (key: string, value: boolean) => {
    const configItem = getConfigItem(key);
    dispatch(
      updateCustomComponentConfig(key, {
        ...configItem,
        list: value,
      } as ComponentConfig),
    );
  };

  const handleUpdateIterable = (key: string, value: boolean) => {
    const configItem = getConfigItem(key);
    dispatch(
      updateCustomComponentConfig(key, {
        ...configItem,
        iterable: value,
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

  const handleUpdateSelectOptions = (key: string, options: ComponentConfig$Select['options']) => {
    const configItem = getConfigItem(key);
    dispatch(
      updateCustomComponentConfig(key, {
        ...configItem,
        options,
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
