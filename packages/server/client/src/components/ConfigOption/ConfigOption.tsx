import * as React from 'react';
import Button from '@faculty/adler-web-components/atoms/Button';
import {
  WidgetProp,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
  ComponentConfig,
  Mode,
} from 'canvas-types';
import { StaticConfig } from 'components/ConfigOption/StaticConfig';
import { VariableConfig } from 'components/ConfigOption/VariableConfig';
import { WidgetConfig } from 'components/ConfigOption/WidgetConfig';
import { ModeButtons } from 'components/ConfigOption/ModeButtons';

import * as Styles from './ConfigOption.styles';

interface ConfigOptionProps {
  widgetProp: WidgetProp;
  config: ComponentConfig;
  onChange: (prop: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget) => void;
  onModeChange: (mode: Mode) => void;
  onDelete?: () => void;
  nested?: boolean;
  modeOptions: Mode[];
}

export const ConfigOption = ({
  widgetProp,
  config,
  onChange,
  onModeChange,
  onDelete,
  nested = false,
  modeOptions,
}: ConfigOptionProps): JSX.Element => {
  if (!widgetProp) {
    onModeChange('static');
    return <div />;
  }

  const handleDelete = () => {
    if (onDelete) onDelete();
  };

  return (
    <Styles.Container nested={nested}>
      {onDelete && (
        <Button
          icon="delete"
          style={Button.styles.naked}
          color={Button.colors.secondary}
          size={Button.sizes.medium}
          onClick={handleDelete}
        />
      )}
      <Styles.Header>
        {!nested && <Styles.Label>{config.label}</Styles.Label>}
        <ModeButtons mode={widgetProp.mode} onModeChange={onModeChange} modeOptions={modeOptions} />
      </Styles.Header>
      {widgetProp.mode === 'static' && (
        <StaticConfig widgetProp={widgetProp} config={config} onChange={onChange} />
      )}
      {widgetProp.mode === 'variable' && (
        <VariableConfig widgetProp={widgetProp} config={config} onChange={onChange} />
      )}
      {widgetProp.mode === 'widget' && <WidgetConfig widgetProp={widgetProp} onChange={onChange} />}
    </Styles.Container>
  );
};
