import * as React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { Edit, Functions, Widgets } from '@material-ui/icons';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  FunctionVariableArg,
  FunctionVariable$StaticArg,
  FunctionVariable$VariableArg,
  FunctionVariable$WidgetArg,
} from 'canvas-types';
import { getWidgetsInTree, getVariables, makeGetComponents } from 'selectors/element';

import * as Styles from './FunctionVariableArgConfig.styles';

const booleanOptions = [
  { value: true, label: 'True' },
  { value: false, label: 'False' },
];

interface IFoo<T extends FunctionVariableArg> {
  name: string;
  arg: T;
  onChange: (arg: FunctionVariableArg) => void;
  valueType: 'string' | 'number' | 'boolean';
}

const InputConfig = ({
  name,
  valueType,
  arg,
  onChange,
}: IFoo<FunctionVariable$StaticArg>): JSX.Element => {
  const handleStringValueChange = (value: string) =>
    onChange({ type: 'static', valueType: 'string', value });

  const handleNumberValueChange = (value: number) =>
    onChange({ type: 'static', valueType: 'number', value });

  const handleBooleanValueChange = ({ value }: any) =>
    onChange({ type: 'static', valueType: 'boolean', value: value as boolean });

  return (
    <>
      {valueType === 'string' && typeof arg.value !== 'boolean' && (
        <Input label={name} value={arg.value} onChange={handleStringValueChange} />
      )}
      {valueType === 'number' && typeof arg.value !== 'boolean' && (
        <Input label={name} type="number" value={arg.value} onChange={handleNumberValueChange} />
      )}
      {valueType === 'boolean' && (
        <Select
          label={name}
          value={booleanOptions.find((o) => o.value === arg.value)}
          onChange={handleBooleanValueChange}
          options={booleanOptions}
        />
      )}
    </>
  );
};

const VariableConfig = ({
  name,
  arg,
  valueType,
  onChange,
}: IFoo<FunctionVariable$VariableArg>): JSX.Element => {
  const handleOnChange = ({ value }: any) => {
    onChange({ type: 'variable', variableId: value as string });
  };

  const variables = Object.values(useSelector(getVariables)).filter(
    (v) => v.type === 'static' && v.valueType === valueType,
  );

  const options = variables.map((v) => ({ value: v.id, label: v.name }));

  return (
    <Select
      label={name}
      value={options.find((o) => o.value === arg.variableId)}
      onChange={handleOnChange}
      options={options}
    />
  );
};

const WidgetConfig = ({ name, arg, onChange }: IFoo<FunctionVariable$WidgetArg>): JSX.Element => {
  const components = useSelector(makeGetComponents());

  const handleWidgetIdChange = ({ value }: any) => {
    onChange({ type: 'widget', widgetId: value as string, property: arg.property });
  };

  const handlePropertyChange = ({ value }: any) => {
    onChange({ type: 'widget', widgetId: arg.widgetId, property: value as string });
  };

  const widgets = Object.values(useSelector(getWidgetsInTree)).filter((w) => {
    const comp = components.find((c) => c.name === w.component);
    if (comp) return comp?.exposedProperties.length > 0;
    return false;
  });

  const selectedWidget = widgets.find((w) => w.id === arg.widgetId);
  const exposedPropertyOptions = selectedWidget
    ? components
        .find((c) => c.name === selectedWidget.component)
        ?.exposedProperties.map((p) => ({ value: p, label: p })) ?? []
    : [];

  const widgetOptions = widgets.map((w) => ({ label: w.name, value: w.id }));

  return (
    <>
      <Select
        label={name}
        value={widgetOptions.find((o) => o.value === arg.widgetId)}
        onChange={handleWidgetIdChange}
        options={widgetOptions}
      />
      <Select
        label="Widget property"
        value={{ value: arg.property, label: arg.property }}
        onChange={handlePropertyChange}
        options={exposedPropertyOptions}
      />
    </>
  );
};

interface Props {
  name: string;
  valueType: 'string' | 'number' | 'boolean';
  arg: FunctionVariableArg;
  onChange: (argName: string, arg: FunctionVariableArg) => void;
}

export const FunctionVariableArgConfig = ({
  name,
  valueType,
  arg,
  onChange,
}: Props): JSX.Element => {
  const handleOnChange = (a: FunctionVariableArg) => onChange(name, a);

  const handleToggleMode = (m: 'static' | 'variable' | 'widget') => () => {
    if (m === 'static') onChange(name, { type: 'static', valueType: 'string', value: '' });
    if (m === 'variable') onChange(name, { type: 'variable', variableId: '' });
    if (m === 'widget') onChange(name, { type: 'widget', widgetId: '', property: '' });
  };

  const getColor = (m: 'static' | 'variable' | 'widget') =>
    arg.type === m ? '#fa7268' : '#9c9c9c';

  return (
    <Styles.Container>
      {arg.type === 'static' && (
        <InputConfig name={name} valueType={valueType} arg={arg} onChange={handleOnChange} />
      )}
      {arg.type === 'variable' && (
        <VariableConfig name={name} valueType={valueType} arg={arg} onChange={handleOnChange} />
      )}
      {arg.type === 'widget' && (
        <WidgetConfig name={name} valueType={valueType} arg={arg} onChange={handleOnChange} />
      )}
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
    </Styles.Container>
  );
};
