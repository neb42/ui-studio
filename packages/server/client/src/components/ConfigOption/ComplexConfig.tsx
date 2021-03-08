import * as React from 'react';
import Button from '@faculty/adler-web-components/atoms/Button';
import {
  ComponentConfig$Complex,
  WidgetProp,
  WidgetProp$Complex,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
  Mode,
} from 'canvas-types';
import { ConfigOption } from 'components/ConfigOption';
import { WidgetModel } from 'models/widget';

import { ModeButtons } from './ModeButtons';
import * as Styles from './ConfigOption.styles';

interface ComplexConfigProps {
  listItem?: boolean;
  label?: string;
  widgetProp: WidgetProp$Complex;
  config: ComponentConfig$Complex;
  onChange: (propKey: string, prop: WidgetProp) => any;
  onDelete?: () => void;
}

export const ComplexConfig = ({
  listItem,
  label,
  widgetProp,
  config,
  onChange,
  onDelete,
}: ComplexConfigProps): JSX.Element => {
  const handleOnChange = (key: string) => (
    subProp: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget,
  ) => {
    const prop: WidgetProp$Complex = { ...widgetProp };
    prop.props[key] = subProp;
    onChange(config.key, prop);
  };

  const handleModeChange = (key: string, idx: number) => (m: Mode) => {
    const defaultProp = ((): WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget => {
      switch (m) {
        case 'static': {
          return {
            mode: 'static' as const,
            type: config.config[idx].type,
            value: config.config[idx].defaultValue,
          };
        }
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
    handleOnChange(key)(defaultProp);
  };

  const handleDelete = () => {
    if (onDelete) onDelete();
  };

  const handleRootModeChange = (m: Mode) => {
    const defaultProp = WidgetModel.getDefaultProp(m, config, widgetProp);
    onChange(config.key, defaultProp);
  };

  return (
    <Styles.ComplexContainer listItem={Boolean(listItem)}>
      <Styles.Header>
        <Styles.Label>{label || config.label}</Styles.Label>
        {onDelete && (
          <Button
            icon="delete"
            style={Button.styles.naked}
            color={Button.colors.secondary}
            size={Button.sizes.medium}
            onClick={handleDelete}
          />
        )}
        {!listItem && (
          <ModeButtons
            mode={widgetProp.mode}
            onModeChange={handleRootModeChange}
            modeOptions={['complex', 'static', 'variable']}
          />
        )}
      </Styles.Header>
      {config.config.map((c, idx) => (
        <ConfigOption
          key={idx}
          widgetProp={widgetProp.props[c.key]}
          config={c}
          onChange={handleOnChange(c.key)}
          onModeChange={handleModeChange(c.key, idx)}
          // modeOptions={['static', 'variable', 'widget']}
          modeOptions={[]}
          nested
        />
      ))}
    </Styles.ComplexContainer>
  );
};
