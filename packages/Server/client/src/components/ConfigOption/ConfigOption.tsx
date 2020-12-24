import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Select, MenuItem, TextField } from '@material-ui/core';
import { Edit, Functions, Widgets } from '@material-ui/icons';
import { Widget } from '@ui-builder/types';
import { updateWidgetProps } from 'actions/widget';
import { getWidgets, getVariables } from 'selectors/element';
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

const StaticConfig = ({ widget, config, onChange }: IFoo): JSX.Element => {
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
          style={{ width: '100%' }}
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

const VariableConfig = ({ widget, config, onChange }: IFoo): JSX.Element => {
  const handleOnChange = (event: SelectEvent) => {
    onChange(event.target.value as string);
  };

  const variables = Object.values(useSelector(getVariables));

  return (
    <Select
      value={widget?.props?.[config.key]?.value ?? ''}
      onChange={handleOnChange}
      style={{ width: '100%' }}
    >
      {variables.map((v) => (
        <MenuItem key={v.id} value={v.id}>
          {v.name}
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

  const mode = widget?.props?.[config.key]?.mode ?? 'static';

  const handleOnChange = (m: 'static' | 'variable' | 'widget') => (value: string) => {
    dispatch(updateWidgetProps(widget.id, config.key, m, value));
  };

  const handleToggleMode = (m: 'static' | 'variable' | 'widget') => () => {
    handleOnChange(m)('');
  };

  const getColor = (m: 'static' | 'variable' | 'widget') => (mode === m ? '#fa7268' : '#9c9c9c');

  return (
    <Styles.Container>
      <Styles.Header>
        <Styles.Label>{config.label}</Styles.Label>
        <Styles.ModeButtons>
          <IconButton onClick={handleToggleMode('static')} size="small">
            <Edit style={{ color: getColor('static') }} />
          </IconButton>
          <IconButton onClick={handleToggleMode('variable')} size="small">
            <Functions style={{ color: getColor('variable') }} />
          </IconButton>
          <IconButton onClick={handleToggleMode('widget')} size="small">
            <Widgets style={{ color: getColor('widget') }} />
          </IconButton>
        </Styles.ModeButtons>
      </Styles.Header>
      {mode === 'static' && (
        <StaticConfig widget={widget} config={config} onChange={handleOnChange('static')} />
      )}
      {mode === 'variable' && (
        <VariableConfig widget={widget} config={config} onChange={handleOnChange('variable')} />
      )}
      {mode === 'widget' && (
        <WidgetConfig widget={widget} config={config} onChange={handleOnChange('widget')} />
      )}
    </Styles.Container>
  );
};
