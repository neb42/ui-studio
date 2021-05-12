import * as React from 'react';
import Button from '@faculty/adler-web-components/atoms/Button';
import Select from '@faculty/adler-web-components/atoms/Select';
import Checkbox from '@faculty/adler-web-components/atoms/Checkbox';
import Input from '@faculty/adler-web-components/atoms/Input';
import { ComponentConfig, ComponentConfig$Select } from '@ui-studio/types';

import * as Styles from './CustomComponentConfig.styles';

type Props = {
  config: ComponentConfig[];
  onAddConfig: () => any;
  onRemoveConfig: (key: string) => any;
  onUpdateName: (key: string, name: string) => any;
  onUpdateMode: (key: string, mode: 'input' | 'select') => any;
  onUpdateType: (key: string, type: 'string' | 'number' | 'boolean') => any;
  onUpdateList: (key: string, value: boolean) => any;
  onUpdateIterable: (key: string, value: boolean) => any;
  onUpdateDefaultValue: (key: string, value: any) => any;
  onUpdateSelectOptions: (key: string, options: ComponentConfig$Select['options']) => any;
};

// Currently not supporting complex components or object types
export const CustomComponentConfigComponent = ({
  config,
  onAddConfig,
  onRemoveConfig,
  onUpdateName,
  onUpdateMode,
  onUpdateType,
  onUpdateList,
  onUpdateIterable,
  onUpdateDefaultValue,
  onUpdateSelectOptions,
}: Props): JSX.Element => {
  const getConfigItem = (key: string) => {
    const configItem = config.find((c) => c.key === key);
    if (!configItem) throw Error();
    return configItem;
  };

  const handleRemoveConfig = (key: string) => () => onRemoveConfig(key);

  const handleNameChange = (key: string) => (value: string) => {
    onUpdateName(key, value);
  };

  const handleModeChange = (key: string) => ({ value }: any) => {
    onUpdateMode(key, value);
  };

  const handleTypeChange = (key: string) => ({ value }: any) => {
    onUpdateType(key, value);
  };

  const handleListChange = (key: string) => (value: boolean) => onUpdateList(key, value);

  const handleIterableChange = (key: string) => (value: boolean) => onUpdateIterable(key, value);

  const handleInputBooleanDefaultValueChange = (key: string) => (value: boolean) =>
    onUpdateDefaultValue(key, value);

  const handleInputNonBooleanDefaultValueChange = (key: string) => (value: string | number) =>
    onUpdateDefaultValue(key, value);

  const handleSelectBooleanTrueValueChange = (key: string) => (value: string) => {
    const configItem = getConfigItem(key);
    if (configItem.component !== 'select' || configItem.type !== 'boolean') throw Error();
    const falseValue = configItem.options.find((o) => o.key === false) as {
      key: boolean;
      label: string;
    };
    if (!falseValue || typeof falseValue.key !== 'boolean') throw Error();
    const options = [{ label: value, key: true }, falseValue];
    onUpdateSelectOptions(key, options);
  };

  const handleSelectBooleanFalseValueChange = (key: string) => (value: string) => {
    const configItem = getConfigItem(key);
    if (configItem.component !== 'select' || configItem.type !== 'boolean') throw Error();
    const trueValue = configItem.options.find((o) => o.key === true) as {
      key: boolean;
      label: string;
    };
    if (!trueValue || typeof trueValue.key !== 'boolean') throw Error();
    const options = [trueValue, { label: value, key: false }];
    onUpdateSelectOptions(key, options);
  };

  const handleAddSelectOption = (key: string) => () => {
    const configItem = getConfigItem(key);
    if (configItem.component !== 'select' || configItem.type === 'boolean') throw Error();
    const options = [...configItem.options, { label: '', key: '' }];
    onUpdateSelectOptions(key, options as ComponentConfig$Select['options']);
  };

  const handleUpdateSelectOption = (key: string, idx: number) => (value: string | number) => {
    const configItem = getConfigItem(key);
    if (configItem.component !== 'select' || configItem.type === 'boolean') throw Error();
    const options = [...configItem.options];
    if (configItem.type === 'string')
      options[idx] = { label: value.toString(), key: value.toString() };
    if (configItem.type === 'number')
      options[idx] = { label: value.toString(), key: Number(value) };
    onUpdateSelectOptions(key, options as ComponentConfig$Select['options']);
  };

  const handleRemoveSelectOption = (key: string, idx: number) => () => {
    const configItem = getConfigItem(key);
    if (configItem.component !== 'select' || configItem.type === 'boolean') throw Error();
    const options = [...configItem.options].filter((_, i) => i !== idx);
    onUpdateSelectOptions(key, options as ComponentConfig$Select['options']);
  };

  return (
    <Styles.Container>
      {config.map((c) => (
        <Styles.ConfigItem key={c.key}>
          <Button
            icon="delete"
            color={Button.colors.secondary}
            style={Button.styles.naked}
            size={Button.sizes.medium}
            onClick={handleRemoveConfig(c.key)}
          />
          <Input label="Name" value={c.label} onChange={handleNameChange(c.key)} />
          <Select
            label="Mode"
            onChange={handleModeChange(c.key)}
            value={{
              value: c.component,
              label: c.component.replace(/^\w/, (w) => w.toUpperCase()),
            }}
            options={['input', 'select'].map((m) => ({
              value: m,
              label: m.replace(/^\w/, (w) => w.toUpperCase()),
            }))}
          />
          {c.component !== 'complex' && (
            <>
              <Select
                label="Type"
                onChange={handleTypeChange(c.key)}
                value={{
                  value: c.type,
                  label: c.type.replace(/^\w/, (w) => w.toUpperCase()),
                }}
                options={['string', 'number', 'boolean'].map((m) => ({
                  value: m,
                  label: m.replace(/^\w/, (w) => w.toUpperCase()),
                }))}
              />
              <Checkbox controlled checked={Boolean(c.list)} onChange={handleListChange(c.key)}>
                List
              </Checkbox>
              <Checkbox
                controlled
                checked={Boolean(c.iterable)}
                disabled={!c.list && c.type !== 'object'}
                onChange={handleIterableChange(c.key)}
              >
                Iterable
              </Checkbox>
            </>
          )}
          {c.component === 'input' && c.type !== 'boolean' && (
            <Input
              type={c.type}
              label="Default value"
              value={c.defaultValue}
              onChange={handleInputNonBooleanDefaultValueChange(c.key)}
            />
          )}
          {c.component === 'input' && c.type === 'boolean' && (
            <Checkbox
              controlled
              checked={c.defaultValue}
              onChange={handleInputBooleanDefaultValueChange(c.key)}
            >
              Default value
            </Checkbox>
          )}
          {c.component === 'select' && c.type === 'boolean' && (
            <>
              <Input
                label="True label"
                value={c.options.find((v) => v.key === true)?.label ?? ''}
                onChange={handleSelectBooleanTrueValueChange}
              />
              <Input
                label="False label"
                value={c.options.find((v) => v.key === false)?.label ?? ''}
                onChange={handleSelectBooleanFalseValueChange}
              />
            </>
          )}
          {c.component === 'select' && c.type !== 'boolean' && (
            <>
              {c.options.map((o: any, ii: any) => (
                <Styles.SelectOption key={ii}>
                  <Input
                    type={c.type}
                    value={o.label}
                    onChange={handleUpdateSelectOption(c.key, ii)}
                  />
                  <Button
                    icon="delete"
                    color={Button.colors.secondary}
                    style={Button.styles.naked}
                    size={Button.sizes.medium}
                    onClick={handleRemoveSelectOption(c.key, ii)}
                  />
                </Styles.SelectOption>
              ))}
              <Button
                icon="add"
                text="Add select option"
                color={Button.colors.primary}
                style={Button.styles.outline}
                size={Button.sizes.small}
                onClick={handleAddSelectOption(c.key)}
              />
            </>
          )}
        </Styles.ConfigItem>
      ))}
      <Button
        icon="add"
        text="Add component config"
        color={Button.colors.primary}
        style={Button.styles.outline}
        size={Button.sizes.medium}
        onClick={onAddConfig}
      />
      <div style={{ height: 24 }} />
    </Styles.Container>
  );
};
