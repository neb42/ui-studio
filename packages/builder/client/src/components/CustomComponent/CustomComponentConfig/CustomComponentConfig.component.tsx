import * as React from 'react';
import Button from '@faculty/adler-web-components/atoms/Button';
import Select from '@faculty/adler-web-components/atoms/Select';
import Checkbox from '@faculty/adler-web-components/atoms/Checkbox';
import Input from '@faculty/adler-web-components/atoms/Input';
import { ComponentConfig } from '@ui-studio/types';
import { OpenAPIV3 } from 'openapi-types';

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
  onUpdateSelectOptions: (
    key: string,
    options: { key: string | number | boolean; label: string }[],
  ) => any;
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
    const falseValue = { label: 'False', key: false };
    const options = [{ label: value, key: true }, falseValue];
    onUpdateSelectOptions(key, options);
  };

  const handleSelectBooleanFalseValueChange = (key: string) => (value: string) => {
    const trueValue = { label: 'True', key: true };
    const options = [trueValue, { label: value, key: false }];
    onUpdateSelectOptions(key, options);
  };

  const handleAddSelectOption = (key: string) => () => {
    const configItem = getConfigItem(key);
    const existingOptions = (() => {
      if (configItem.schema.type === 'array') {
        if ('ref' in configItem.schema.items) throw new Error();
        return (configItem.schema.items as OpenAPIV3.SchemaObject).enum || [];
      }
      return configItem.schema.enum || [];
    })().map((e) => {
      if (e === true) return { label: 'True', key: true };
      if (e === false) return { label: 'False', key: false };
      return { label: e, key: e };
    });
    const options = [...existingOptions, { label: '', key: '' }];
    onUpdateSelectOptions(key, options);
  };

  const handleUpdateSelectOption = (key: string, idx: number) => (value: string | number) => {
    const configItem = getConfigItem(key);
    const options = (() => {
      if (configItem.schema.type === 'array') {
        if ('ref' in configItem.schema.items) throw new Error();
        return (configItem.schema.items as OpenAPIV3.SchemaObject).enum || [];
      }
      return configItem.schema.enum || [];
    })().map((e) => {
      if (e === true) return { label: 'True', key: true };
      if (e === false) return { label: 'False', key: false };
      return { label: e, key: e };
    });
    options[idx] = { label: value.toString(), key: value };
    onUpdateSelectOptions(key, options);
  };

  const handleRemoveSelectOption = (key: string, idx: number) => () => {
    const configItem = getConfigItem(key);
    const options = (() => {
      if (configItem.schema.type === 'array') {
        if ('ref' in configItem.schema.items) throw new Error();
        return (configItem.schema.items as OpenAPIV3.SchemaObject).enum || [];
      }
      return configItem.schema.enum || [];
    })()
      .map((e) => {
        if (e === true) return { label: 'True', key: true };
        if (e === false) return { label: 'False', key: false };
        return { label: e, key: e };
      })
      .filter((_, i) => i !== idx);
    onUpdateSelectOptions(key, options);
  };

  return (
    <Styles.Container>
      {config.map((c) => {
        const configItem = getConfigItem(c.key);

        const control = (() => {
          if (configItem.schema.type === 'array') {
            return 'enum' in (configItem.schema as OpenAPIV3.ArraySchemaObject).items
              ? 'select'
              : 'input';
          }
          return 'enum' in configItem.schema ? 'select' : 'input';
        })();

        const type = (() => {
          const rawType = (() => {
            if (configItem.schema.type === 'array') {
              if ('ref' in configItem.schema.items) throw new Error();
              return (configItem.schema.items as OpenAPIV3.NonArraySchemaObject).type;
            }
            return configItem.schema.type;
          })();
          if (!rawType) throw new Error();
          if (rawType === 'integer') return 'number';
          if (rawType === 'string' || rawType === 'number' || rawType === 'boolean') return rawType;
          throw new Error();
        })();

        const list = configItem.schema.type === 'array';

        const options = (() => {
          if (configItem.schema.type === 'array') {
            if ('ref' in configItem.schema.items) throw new Error();
            return (configItem.schema.items as OpenAPIV3.SchemaObject).enum || [];
          }
          return configItem.schema.enum || [];
        })().map((e) => {
          if (e === true) return { label: 'True', key: true };
          if (e === false) return { label: 'False', key: false };
          return { label: e, key: e };
        });

        return (
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
                value: control,
                label: control.replace(/^\w/, (w) => w.toUpperCase()),
              }}
              options={['input', 'select'].map((m) => ({
                value: m,
                label: m.replace(/^\w/, (w) => w.toUpperCase()),
              }))}
            />
            <Select
              label="Type"
              onChange={handleTypeChange(c.key)}
              value={{
                value: type,
                label: type.replace(/^\w/, (w) => w.toUpperCase()),
              }}
              options={['string', 'number', 'boolean'].map((m) => ({
                value: m,
                label: m.replace(/^\w/, (w) => w.toUpperCase()),
              }))}
            />
            <Checkbox controlled checked={Boolean(list)} onChange={handleListChange(c.key)}>
              List
            </Checkbox>
            <Checkbox
              controlled
              checked={Boolean(c.iterable)}
              disabled={!list}
              onChange={handleIterableChange(c.key)}
            >
              Iterable
            </Checkbox>
            {control === 'input' && type !== 'boolean' && (
              <Input
                type={type}
                label="Default value"
                value={c.defaultValue}
                onChange={handleInputNonBooleanDefaultValueChange(c.key)}
              />
            )}
            {control === 'input' && type === 'boolean' && (
              <Checkbox
                controlled
                checked={c.defaultValue}
                onChange={handleInputBooleanDefaultValueChange(c.key)}
              >
                Default value
              </Checkbox>
            )}
            {control === 'select' && type === 'boolean' && (
              <>
                <Input
                  label="True label"
                  value={options.find((v) => v.key === true)?.label ?? ''}
                  onChange={handleSelectBooleanTrueValueChange}
                />
                <Input
                  label="False label"
                  value={options.find((v) => v.key === false)?.label ?? ''}
                  onChange={handleSelectBooleanFalseValueChange}
                />
              </>
            )}
            {control === 'select' && type !== 'boolean' && (
              <>
                {options.map((o: any, ii: any) => (
                  <Styles.SelectOption key={ii}>
                    <Input
                      type={type}
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
        );
      })}
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
