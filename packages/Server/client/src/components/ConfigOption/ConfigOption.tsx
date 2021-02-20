import * as React from 'react';
import { IconButton } from '@material-ui/core';
import { Edit, Functions, Widgets } from '@material-ui/icons';
import Button from '@faculty/adler-web-components/atoms/Button';
import {
  WidgetProp,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
  ComponentConfig,
} from 'canvas-types';
import { StaticConfig } from 'components/ConfigOption/StaticConfig';
import { VariableConfig } from 'components/ConfigOption/VariableConfig';
import { WidgetConfig } from 'components/ConfigOption/WidgetConfig';

import * as Styles from './ConfigOption.styles';

interface ConfigOptionProps {
  widgetProp: WidgetProp;
  config: ComponentConfig;
  onChange: (prop: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget) => void;
  onModeChange: (mode: 'static' | 'variable' | 'widget') => void;
  onDelete?: () => void;
  nested?: boolean;
}

export const ConfigOption = ({
  widgetProp,
  config,
  onChange,
  onModeChange,
  onDelete,
  nested = false,
}: ConfigOptionProps): JSX.Element => {
  const handleToggleMode = (m: 'static' | 'variable' | 'widget') => () => onModeChange(m);

  if (!widgetProp) {
    onModeChange('static');
    return <div />;
  }

  const getColor = (m: 'static' | 'variable' | 'widget') =>
    widgetProp.mode === m ? '#fa7268' : '#9c9c9c';

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
      {(config.component === 'input' || config.component === 'select') && (
        <>
          {widgetProp.mode === 'static' && (
            <StaticConfig widgetProp={widgetProp} config={config} onChange={onChange} />
          )}
          {widgetProp.mode === 'variable' && (
            <VariableConfig widgetProp={widgetProp} config={config} onChange={onChange} />
          )}
          {widgetProp.mode === 'widget' && (
            <WidgetConfig widgetProp={widgetProp} onChange={onChange} />
          )}
        </>
      )}
    </Styles.Container>
  );
};
