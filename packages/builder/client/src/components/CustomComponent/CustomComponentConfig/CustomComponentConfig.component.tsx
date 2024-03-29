import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddSharp from '@mui/icons-material/AddSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ComponentConfig } from '@ui-studio/types';
import { OpenAPIV3 } from 'openapi-types';
import { Outline } from 'components/Outline';

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

  const handleModeChange = (key: string) => (event: SelectChangeEvent) => {
    onUpdateMode(key, event.target.value as 'input' | 'select');
  };

  const handleTypeChange = (key: string) => (event: SelectChangeEvent) => {
    onUpdateType(key, event.target.value as 'string' | 'number' | 'boolean');
  };

  const handleListChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateList(key, event.target.checked);

    if (event.target.checked === false) {
      onUpdateIterable(key, false);
    }
  };

  const handleIterableChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) =>
    onUpdateIterable(key, event.target.checked);

  const handleInputBooleanDefaultValueChange = (key: string) => (
    _: React.MouseEvent<HTMLElement>,
    v: boolean,
  ) => {
    if (v !== null) onUpdateDefaultValue(key, v);
  };

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

  const handleUpdateSelectOption = (key: string, idx: number) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
          <Outline key={c.key}>
            <Styles.ConfigItem>
              <IconButton onClick={handleRemoveConfig(c.key)} size="small">
                <DeleteSharp />
              </IconButton>
              <TextField label="Name" value={c.label} onChange={handleNameChange(c.key)} />
              <FormControl fullWidth>
                <InputLabel>Mode</InputLabel>
                <Select value={control} label="Mode" onChange={handleModeChange(c.key)}>
                  {['input', 'select'].map((m) => (
                    <MenuItem key={m} value={m}>
                      {m.replace(/^\w/, (w) => w.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={type} label="Type" onChange={handleTypeChange(c.key)}>
                  {['string', 'number', 'boolean'].map((m) => (
                    <MenuItem key={m} value={m}>
                      {m.replace(/^\w/, (w) => w.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                label="List"
                control={<Checkbox checked={Boolean(list)} onChange={handleListChange(c.key)} />}
              />
              <FormControlLabel
                label="Iterable"
                control={
                  <Checkbox
                    checked={Boolean(c.iterable)}
                    disabled={!list}
                    onChange={handleIterableChange(c.key)}
                  />
                }
              />
              {control === 'input' && type !== 'boolean' && (
                <TextField
                  inputProps={type === 'number' ? { inputMode: 'numeric', pattern: '[0-9]*' } : {}}
                  label="Default value"
                  value={c.defaultValue}
                  onChange={handleInputNonBooleanDefaultValueChange(c.key)}
                />
              )}
              {control === 'input' && type === 'boolean' && (
                <Outline label="Default value">
                  <ToggleButtonGroup
                    value={c.defaultValue}
                    exclusive
                    onChange={handleInputBooleanDefaultValueChange(c.key)}
                    fullWidth
                    color="primary"
                    size="small"
                  >
                    <ToggleButton value>True</ToggleButton>
                    <ToggleButton value={false}>False</ToggleButton>
                  </ToggleButtonGroup>
                </Outline>
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
                        inputProps={
                          type === 'number' ? { inputMode: 'numeric', pattern: '[0-9]*' } : {}
                        }
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
          </Outline>
        );
      })}
      <Button variant="outlined" onClick={onAddConfig} startIcon={<AddSharp />}>
        Add component config
      </Button>
      <div style={{ height: 24 }} />
    </Styles.Container>
  );
};
