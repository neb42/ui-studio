import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { Edit, Functions, Widgets } from '@material-ui/icons';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  Widget,
  ComponentConfig,
  WidgetProp,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
} from '@ui-builder/types';
import { updateWidgetProps } from 'actions/widget';
import { makeGetComponents, getWidgets, getVariables } from 'selectors/element';

import * as Styles from './ConfigOption.styles';

interface IFoo {
  widget: Widget;
  config: ComponentConfig;
  onChange: (value: WidgetProp) => void;
}

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

  const handleInputOnChange = (value: string) => {
    onChange(buildStaticWidgetProp(value));
  };
  const handleSelectOnChange = ({ value }: any) => {
    onChange(buildStaticWidgetProp(value as string));
  };

  switch (config.component) {
    case 'input':
      switch (config.type) {
        case 'string':
        case 'number': {
          if (typeof widgetProp.value === 'boolean') throw Error();
          return <Input label="value" onChange={handleInputOnChange} value={widgetProp.value} />;
        }
        case 'boolean':
          return <div>Not implemented</div>;
        default:
          throw Error();
      }
    case 'select': {
      const v = config.options.find((o) => o.key === widgetProp.value);
      return (
        <Select
          label="Value"
          value={v ? { value: v.key, label: v.label } : null}
          onChange={handleSelectOnChange}
          options={config.options.map((o) => ({ value: o.key, label: o.label }))}
        />
      );
    }
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
  const selectedVariable = variables.find((v) => v.id === selectedVariableId);

  const handleIdChange = ({ value }: any) => {
    const newVariableId = value as string;
    const newVariable = variables.find((v) => v.id === newVariableId);
    if (newVariable === undefined) return;
    onChange(buildVariableWidgetProps(newVariableId, newVariable.valueType, ''));
  };

  const handleLookupChange = (value: string) => {
    onChange(buildVariableWidgetProps(selectedVariableId, 'object', value));
  };

  return (
    <>
      <Select
        label="Variable"
        value={
          selectedVariable ? { value: selectedVariable.id, label: selectedVariable.name } : null
        }
        onChange={handleIdChange}
        options={variables.map((v) => ({ value: v.id, label: v.name }))}
      />
      {widgetProp.type === 'object' && (
        <Input
          label="Object property"
          onChange={handleLookupChange}
          value={widgetProp.lookup}
          // TODO add validation function
          error={
            config.type !== 'object' && widgetProp.lookup.length === 0 ? 'Required' : undefined
          }
        />
      )}
    </>
  );
};

const WidgetConfig = ({ widget, config, onChange }: IFoo): JSX.Element => {
  const components = useSelector(makeGetComponents());

  const widgetProp = widget.props[config.key];

  if (widgetProp.mode !== 'widget')
    throw Error(`Trying to render widget config editor for ${widgetProp.mode} prop`);

  const buildWidgetWidgetProps = (widgetId: string, lookup: string): WidgetProp$Widget => ({
    mode: 'widget',
    widgetId,
    lookup,
  });

  const handleIdChange = ({ value }: any) => {
    onChange(buildWidgetWidgetProps(value as string, widgetProp.lookup));
  };

  const handleLookupChange = ({ value }: any) => {
    onChange(buildWidgetWidgetProps(widgetProp.widgetId, value as string));
  };

  const widgets = Object.values(useSelector(getWidgets)).filter((w) => {
    const comp = components.find((c) => c.name === w.component);
    if (comp) return comp?.exposedProperties.length > 0;
    return false;
  });
  const selectedWidget = widgets.find((w) => w.id === widgetProp.widgetId);
  const exposedPropertyOptions = selectedWidget
    ? components
        .find((c) => c.name === selectedWidget.component)
        ?.exposedProperties.map((p) => ({ value: p, label: p })) ?? []
    : [];

  return (
    <>
      <Select
        label="Widget"
        value={selectedWidget ? { value: selectedWidget.id, label: selectedWidget.name } : null}
        onChange={handleIdChange}
        options={widgets.map((w) => ({ value: w.id, label: w.name }))}
      />
      <Select
        label="Widget property"
        value={{ value: widgetProp.lookup, label: widgetProp.lookup }}
        onChange={handleLookupChange}
        options={exposedPropertyOptions}
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
            value: config.component === 'select' ? config.options[0]?.key : '',
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
