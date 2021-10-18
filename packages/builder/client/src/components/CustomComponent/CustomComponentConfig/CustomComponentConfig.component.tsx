import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddSharp from '@mui/icons-material/AddSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import Select from '@faculty/adler-web-components/atoms/Select';
import Checkbox from '@faculty/adler-web-components/atoms/Checkbox';
import TextField from '@mui/material/TextField';
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

  const handleNameChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateName(key, event.target.value);
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

  const handleInputNonBooleanDefaultValueChange = (key: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => onUpdateDefaultValue(key, event.target.value);

  const handleSelectBooleanTrueValueChange = (key: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const falseValue = { label: 'False', key: false };
    const options = [{ label: event.target.value, key: true }, falseValue];
    onUpdateSelectOptions(key, options);
  };

  const handleSelectBooleanFalseValueChange = (key: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const trueValue = { label: 'True', key: true };
    const options = [trueValue, { label: event.target.value, key: false }];
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

  const handleUpdateSelectOption = (key: string, idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
    options[idx] = { label: event.target.value.toString(), key: event.target.value };
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
            <IconButton onClick={handleRemoveConfig(c.key)} size="small">
              <DeleteSharp />
            </IconButton>
            <TextField label="Name" value={c.label} onChange={handleNameChange(c.key)} />
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
              <TextField
                inputProps={type === 'number' ? { inputMode: 'numeric', pattern: '[0-9]*' } : {}}
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
                <TextField
                  label="True label"
                  value={options.find((v) => v.key === true)?.label ?? ''}
                  onChange={handleSelectBooleanTrueValueChange(c.key)}
                />
                <TextField
                  label="False label"
                  value={options.find((v) => v.key === false)?.label ?? ''}
                  onChange={handleSelectBooleanFalseValueChange(c.key)}
                />
              </>
            )}
            {control === 'select' && type !== 'boolean' && (
              <>
                {options.map((o: any, ii: any) => (
                  <Styles.SelectOption key={ii}>
                    <TextField
                      type={type}
                      value={o.label}
                      onChange={handleUpdateSelectOption(c.key, ii)}
                    />
                    <IconButton onClick={handleRemoveSelectOption(c.key, ii)} size="small">
                      <DeleteSharp />
                    </IconButton>
                  </Styles.SelectOption>
                ))}
                <Button
                  variant="outlined"
                  onClick={handleAddSelectOption(c.key)}
                  startIcon={<AddSharp />}
                >
                  Add select option
                </Button>
              </>
            )}
          </Styles.ConfigItem>
        );
      })}
      <Button variant="outlined" onClick={onAddConfig} startIcon={<AddSharp />}>
        Add component config
      </Button>
      <div style={{ height: 24 }} />
    </Styles.Container>
  );
};
