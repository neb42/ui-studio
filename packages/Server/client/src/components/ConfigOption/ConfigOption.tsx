import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Select, MenuItem, TextField } from '@material-ui/core';
import { Edit, Functions, Widgets } from '@material-ui/icons';
import {
  Widget,
  ComponentConfig,
  WidgetProp,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
} from '@ui-builder/types';
import { updateWidgetProps } from 'actions/widget';
import { getWidgets, getVariables } from 'selectors/element';

import * as Styles from './ConfigOption.styles';

interface IFoo {
  widget: Widget;
  config: ComponentConfig;
  onChange: (value: WidgetProp) => void;
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type SelectEvent = React.ChangeEvent<{
  name?: string | undefined;
  value: unknown;
}>;

const StaticConfig = ({ widget, config, onChange }: IFoo): JSX.Element => {
  const widgetProp = widget.props[config.key];

  if (widgetProp.mode !== 'static')
    throw Error(`Trying to render static config editor for ${widgetProp.mode} prop`);

  const buildStaticWidgetProp = (v: string | number | boolean): WidgetProp$Static => {
    switch (config.type) {
      case 'string':
        return { mode: 'static', type: 'string', value: v.toString() };
      case 'number':
        return { mode: 'static', type: 'number', value: Number(v) };
      case 'boolean':
        return { mode: 'static', type: 'boolean', value: Boolean(v) };
      case 'object':
        return { mode: 'static', type: 'object', value: v.toString() };
      default:
        throw Error();
    }
  };

  const handleInputOnChange = (event: InputEvent) => {
    onChange(buildStaticWidgetProp(event.target.value));
  };
  const handleSelectOnChange = (event: SelectEvent) => {
    onChange(buildStaticWidgetProp(event.target.value as string));
  };

  switch (config.component) {
    case 'input':
      return (
        <TextField
          onChange={handleInputOnChange}
          value={widgetProp.value}
          style={{ width: '100%' }}
          // TODO add type validation function
        />
      );
    case 'select':
      return (
        <Select value={widgetProp.value} onChange={handleSelectOnChange} style={{ width: '100%' }}>
          {config.options.map((o) => (
            <MenuItem key={o.key} value={o.key}>
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
  const widgetProp = widget.props[config.key];

  if (widgetProp.mode !== 'variable')
    throw Error(`Trying to render variable config editor for ${widgetProp.mode} prop`);

  const buildVariableWidgetProps = (
    variableId: string,
    type: 'string' | 'number' | 'boolean' | 'object',
    lookup?: string,
  ): WidgetProp$Variable => {
    if (type === 'object')
      return {
        mode: 'variable',
        type: 'object',
        variableId,
        lookup: lookup || '',
      };

    return {
      mode: 'variable',
      type,
      variableId,
    };
  };

  const variables = Object.values(useSelector(getVariables)).filter(
    (v) => v.valueType === config.type || v.valueType === 'object',
  );

  const selectedVariableId = widgetProp.variableId;

  const handleIdChange = (event: SelectEvent) => {
    const newVariableId = event.target.value as string;
    const newVariable = variables.find((v) => v.id === newVariableId);
    if (newVariable === undefined) return;
    onChange(buildVariableWidgetProps(newVariableId, newVariable.valueType, ''));
  };

  const handleLookupChange = (event: InputEvent) => {
    onChange(buildVariableWidgetProps(selectedVariableId, 'object', event.target.value));
  };

  return (
    <>
      <Select value={selectedVariableId} onChange={handleIdChange} style={{ width: '100%' }}>
        {variables.map((v) => (
          <MenuItem key={v.id} value={v.id}>
            {v.name}
          </MenuItem>
        ))}
      </Select>
      {widgetProp.type === 'object' && (
        <TextField
          onChange={handleLookupChange}
          value={widgetProp.lookup}
          style={{ width: '100%' }}
          // TODO add validation function
          required={config.type !== 'object'}
        />
      )}
    </>
  );
};

const WidgetConfig = ({ widget, config, onChange }: IFoo): JSX.Element => {
  const widgetProp = widget.props[config.key];

  if (widgetProp.mode !== 'widget')
    throw Error(`Trying to render widget config editor for ${widgetProp.mode} prop`);

  const buildWidgetWidgetProps = (widgetId: string, lookup: string): WidgetProp$Widget => ({
    mode: 'widget',
    widgetId,
    lookup,
  });

  const handleIdChange = (event: SelectEvent) => {
    onChange(buildWidgetWidgetProps(event.target.value as string, widgetProp.lookup));
  };

  const handleLookupChange = (event: InputEvent) => {
    onChange(buildWidgetWidgetProps(widgetProp.widgetId, event.target.value));
  };

  const widgets = Object.values(useSelector(getWidgets));

  return (
    <>
      <Select value={widgetProp.widgetId} onChange={handleIdChange} style={{ width: '100%' }}>
        {widgets.map((w) => (
          <MenuItem key={w.name} value={w.name}>
            {w.name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        onChange={handleLookupChange}
        value={widgetProp.lookup}
        style={{ width: '100%' }}
        // TODO add validation function
        required
      />
    </>
  );
};

interface ConfigOptionProps {
  widget: Widget;
  config: ComponentConfig;
}

export const ConfigOption = ({ widget, config }: ConfigOptionProps): JSX.Element => {
  const dispatch = useDispatch();

  const mode = widget?.props?.[config.key]?.mode ?? 'static';

  const handleOnChange = (prop: WidgetProp) => {
    dispatch(updateWidgetProps(widget.id, config.key, prop));
  };

  const handleToggleMode = (m: 'static' | 'variable' | 'widget') => () => {
    const defaultProp = ((): WidgetProp => {
      switch (m) {
        case 'static':
          return {
            mode: 'static',
            type: 'string',
            value: '',
          };
        case 'variable':
          return {
            mode: 'variable',
            type: 'string',
            variableId: '',
          };
        case 'widget':
          return {
            mode: 'widget',
            widgetId: '',
            lookup: '',
          };
        default:
          throw Error();
      }
    })();
    handleOnChange(defaultProp);
  };

  const widgetProp = widget.props[config.key];

  if (!widgetProp) {
    handleToggleMode('static')();
    return <div />;
  }

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
        <StaticConfig widget={widget} config={config} onChange={handleOnChange} />
      )}
      {mode === 'variable' && (
        <VariableConfig widget={widget} config={config} onChange={handleOnChange} />
      )}
      {mode === 'widget' && (
        <WidgetConfig widget={widget} config={config} onChange={handleOnChange} />
      )}
    </Styles.Container>
  );
};
