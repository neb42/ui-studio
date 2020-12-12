import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Select, MenuItem, TextField } from '@material-ui/core';
import { Edit, Functions, Widgets } from '@material-ui/icons';
import { Widget } from '@ui-builder/types';
import { updateWidgetProps } from 'actions/widget';
import { getWidgets, makeGetFunctions } from 'selectors/element';
import { TComponentConfig } from 'types/store';

import * as Styles from './ConfigOption.styles';

interface IFoo {
  widget: Widget;
  config: TComponentConfig;
  onChange: (value: string) => void;
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type SelectEvent = React.ChangeEvent<{
  name?: string | undefined;
  value: unknown;
}>;

const InputConfig = ({ widget, config, onChange }: IFoo): JSX.Element => {
  const handleInputOnChange = (event: InputEvent) => {
    onChange(event.target.value);
  };
  const handleSelectOnChange = (event: SelectEvent) => {
    onChange(event.target.value as string);
  };

  switch (config.component) {
    case 'input':
      return (
        <TextField
          onChange={handleInputOnChange}
          value={widget?.props?.[config.key]?.value ?? ''}
        />
      );
    case 'select':
      return (
        <Select
          value={widget.props[config.key]?.value ?? ''}
          onChange={handleSelectOnChange}
          style={{ width: '100%' }}
        >
          {config.options.map((o) => (
            <MenuItem key={o.label} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      );
    // case 'checkbox':
    // case 'slider':
    // case 'multislider':
    default:
      return <div />;
  }
};

const FunctionConfig = ({ widget, config, onChange }: IFoo): JSX.Element => {
  const handleOnChange = (event: SelectEvent) => {
    onChange(event.target.value as string);
  };

  const functions = useSelector(makeGetFunctions());

  return (
    <Select
      value={widget?.props?.[config.key]?.value ?? ''}
      onChange={handleOnChange}
      style={{ width: '100%' }}
    >
      {functions.map((f) => (
        <MenuItem key={f.name} value={f.name}>
          {f.name}
        </MenuItem>
      ))}
    </Select>
  );
};

const WidgetConfig = ({ widget, config, onChange }: IFoo): JSX.Element => {
  const handleOnChange = (event: SelectEvent) => {
    onChange(event.target.value as string);
  };

  const widgets = Object.values(useSelector(getWidgets));

  return (
    <Select
      value={widget?.props?.[config.key]?.value ?? ''}
      onChange={handleOnChange}
      style={{ width: '100%' }}
    >
      {widgets.map((w) => (
        <MenuItem key={w.name} value={w.name}>
          {w.name}
        </MenuItem>
      ))}
    </Select>
  );
};

interface IConfigOption {
  widget: Widget;
  config: TComponentConfig;
}

export const ConfigOption = ({ widget, config }: IConfigOption): JSX.Element => {
  const dispatch = useDispatch();
  // const [mode, setMode] = React.useState<'input' | 'function' | 'widget'>(
  //   widget?.props?.[config.key]?.mode ?? 'input',
  // );
  const mode = widget?.props?.[config.key]?.mode ?? 'input';

  const handleOnChange = (m: 'input' | 'function' | 'widget') => (value: string) => {
    dispatch(updateWidgetProps(widget.name, config.key, m, value));
  };

  const handleToggleMode = (m: 'input' | 'function' | 'widget') => () => {
    // setMode(m)
    handleOnChange(m)('');
  };

  const getColor = (m: 'input' | 'function' | 'widget') => (mode === m ? '#fa7268' : '#9c9c9c');

  return (
    <Styles.Container>
      <Styles.Header>
        <Styles.Label>{config.label}</Styles.Label>
        <Styles.ModeButtons>
          <IconButton onClick={handleToggleMode('input')} size="small">
            <Edit style={{ color: getColor('input') }} />
          </IconButton>
          <IconButton onClick={handleToggleMode('function')} size="small">
            <Functions style={{ color: getColor('function') }} />
          </IconButton>
          <IconButton onClick={handleToggleMode('widget')} size="small">
            <Widgets style={{ color: getColor('widget') }} />
          </IconButton>
        </Styles.ModeButtons>
      </Styles.Header>
      {mode === 'input' && (
        <InputConfig widget={widget} config={config} onChange={handleOnChange('input')} />
      )}
      {mode === 'function' && (
        <FunctionConfig widget={widget} config={config} onChange={handleOnChange('function')} />
      )}
      {mode === 'widget' && (
        <WidgetConfig widget={widget} config={config} onChange={handleOnChange('widget')} />
      )}
    </Styles.Container>
  );
};
