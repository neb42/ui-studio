import * as React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { Edit, Functions, Widgets } from '@material-ui/icons';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  FunctionVariableArg,
  Value$Static,
  Value$Variable,
  Value$Widget,
  CustomComponent,
} from '@ui-studio/types';
import { getVariables } from 'selectors/variable';
import { getComponents } from 'selectors/configuration';
import { getRoots, getWidgetsInSelectedTree } from 'selectors/tree';

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

const InputConfig = ({ name, valueType, arg, onChange }: IFoo<Value$Static>): JSX.Element => {
  const handleStringValueChange = (value: string) => onChange({ mode: 'static', value });

  const handleNumberValueChange = (value: number) => onChange({ mode: 'static', value });

  const handleBooleanValueChange = ({ value }: any) =>
    onChange({ mode: 'static', value: value as boolean });

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

const VariableConfig = ({ name, arg, valueType, onChange }: IFoo<Value$Variable>): JSX.Element => {
  const handleOnChange = ({ value }: any) => {
    onChange({ mode: 'variable', variableId: value as string });
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

const WidgetConfig = ({ name, arg, onChange }: IFoo<Value$Widget>): JSX.Element => {
  const roots = useSelector(getRoots);
  const components = useSelector(getComponents);

  const handleWidgetIdChange = ({ value }: any) => {
    onChange({ mode: 'widget', widgetId: value as string, property: arg.property });
  };

  const handlePropertyChange = ({ value }: any) => {
    onChange({ mode: 'widget', widgetId: arg.widgetId, property: value as string });
  };

  const widgets = useSelector(getWidgetsInSelectedTree).filter((w) => {
    if (w.type === 'widget') {
      const comp = components.find((c) => c.key === w.component);
      if (comp && comp.exposedProperties) return comp.exposedProperties.length > 0;
    }
    if (w.type === 'customComponentInstance') {
      const customComponent = roots.find(
        (r): r is CustomComponent => r.id === w.customComponentId && r.type === 'customComponent',
      );
      if (customComponent && customComponent.exposedProperties)
        return Object.keys(customComponent.exposedProperties).length > 0;
    }
    return false;
  });

  const selectedWidget = widgets.find((w) => w.id === arg.widgetId);

  const exposedPropertyOptions = (() => {
    if (selectedWidget) {
      if (selectedWidget.type === 'widget') {
        return (
          components
            .find((c) => c.key === selectedWidget.component)
            ?.exposedProperties?.map((p) => ({ value: p, label: p })) ?? []
        );
      }
      if (selectedWidget.type === 'customComponentInstance') {
        const customComponent = roots.find(
          (r): r is CustomComponent =>
            r.id === selectedWidget.customComponentId && r.type === 'customComponent',
        );
        if (customComponent && customComponent.exposedProperties)
          return Object.keys(customComponent.exposedProperties).map((p) => ({
            value: p,
            label: p,
          }));
        return [];
      }
    }
    return [];
  })();

  const widgetOptions = widgets.map((w) => ({ label: w.name, value: w.id }));

  React.useEffect(() => {
    handlePropertyChange({ value: exposedPropertyOptions[0]?.value });
  }, [arg.widgetId]);

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
    if (m === 'static') onChange(name, { mode: 'static', value: '' });
    if (m === 'variable') onChange(name, { mode: 'variable', variableId: '' });
    if (m === 'widget') onChange(name, { mode: 'widget', widgetId: '', property: '' });
  };

  const getColor = (m: 'static' | 'variable' | 'widget') =>
    arg.mode === m ? '#fa7268' : '#9c9c9c';

  return (
    <Styles.Container>
      {arg.mode === 'static' && (
        <InputConfig name={name} valueType={valueType} arg={arg} onChange={handleOnChange} />
      )}
      {arg.mode === 'variable' && (
        <VariableConfig name={name} valueType={valueType} arg={arg} onChange={handleOnChange} />
      )}
      {arg.mode === 'widget' && (
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
