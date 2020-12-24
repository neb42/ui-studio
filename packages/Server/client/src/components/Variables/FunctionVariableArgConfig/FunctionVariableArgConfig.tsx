import * as React from 'react';
import { useSelector } from 'react-redux';
import { IconButton, Select, MenuItem, TextField } from '@material-ui/core';
import { Edit, Functions, Widgets } from '@material-ui/icons';
import {
  FunctionVariableArg,
  FunctionVariable$StaticArg,
  FunctionVariable$VariableArg,
  FunctionVariable$WidgetArg,
} from '@ui-builder/types';
import { getWidgets, getVariables } from 'selectors/element';

import * as Styles from './FunctionVariableArgConfig.styles';

interface IFoo<T extends FunctionVariableArg> {
  arg: T;
  onChange: (arg: FunctionVariableArg) => void;
  valueType: 'string' | 'number' | 'boolean';
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type SelectEvent = React.ChangeEvent<{
  name?: string | undefined;
  value: unknown;
}>;

const InputConfig = ({
  valueType,
  arg,
  onChange,
}: IFoo<FunctionVariable$StaticArg>): JSX.Element => {
  const handleStringValueChange = (event: InputEvent) =>
    onChange({ type: 'static', valueType: 'string', value: event.target.value as string });

  const handleNumberValueChange = (event: InputEvent) =>
    onChange({ type: 'static', valueType: 'number', value: Number(event.target.value) });

  const handleBooleanValueChange = (event: SelectEvent) =>
    onChange({ type: 'static', valueType: 'boolean', value: (event.target.value as 1 | 0) === 1 });

  return (
    <>
      {valueType === 'string' && (
        <TextField id="value" label="Value" value={arg.value} onChange={handleStringValueChange} />
      )}
      {valueType === 'number' && (
        <TextField
          id="value"
          label="Value"
          type="number"
          value={arg.value}
          onChange={handleNumberValueChange}
        />
      )}
      {valueType === 'boolean' && (
        <Select value={arg.value ? 1 : 0} onChange={handleBooleanValueChange}>
          <MenuItem value={1}>True</MenuItem>
          <MenuItem value={0}>False</MenuItem>
        </Select>
      )}
    </>
  );
};

const VariableConfig = ({
  arg,
  valueType,
  onChange,
}: IFoo<FunctionVariable$VariableArg>): JSX.Element => {
  const handleOnChange = (event: SelectEvent) => {
    onChange({ type: 'variable', variableId: event.target.value as string });
  };

  const variables = Object.values(useSelector(getVariables)).filter(
    (v) => v.type === 'static' && v.valueType === valueType,
  );

  return (
    <Select value={arg.variableId} onChange={handleOnChange} style={{ width: '100%' }}>
      {variables.map((v) => (
        <MenuItem key={v.id} value={v.id}>
          {v.name}
        </MenuItem>
      ))}
    </Select>
  );
};

const WidgetConfig = ({ arg, onChange }: IFoo<FunctionVariable$WidgetArg>): JSX.Element => {
  const handleWidgetIdChange = (event: SelectEvent) => {
    onChange({ type: 'widget', widgetId: event.target.value as string, property: arg.property });
  };

  const handlePropertyChange = (event: SelectEvent) => {
    onChange({ type: 'widget', widgetId: arg.widgetId, property: event.target.value as string });
  };

  const widgets = Object.values(useSelector(getWidgets));

  return (
    <>
      <Select value={arg.widgetId} onChange={handleWidgetIdChange}>
        {widgets.map((w) => (
          <MenuItem key={w.id} value={w.id}>
            {w.name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        id="property"
        label="Property"
        value={arg.property}
        onChange={handlePropertyChange}
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
      <Styles.Header>
        <Styles.Label>{name}</Styles.Label>
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
      {arg.type === 'static' && (
        <InputConfig valueType={valueType} arg={arg} onChange={handleOnChange} />
      )}
      {arg.type === 'variable' && (
        <VariableConfig valueType={valueType} arg={arg} onChange={handleOnChange} />
      )}
      {arg.type === 'widget' && (
        <WidgetConfig valueType={valueType} arg={arg} onChange={handleOnChange} />
      )}
    </Styles.Container>
  );
};
