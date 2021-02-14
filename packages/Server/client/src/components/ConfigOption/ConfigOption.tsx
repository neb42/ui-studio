import * as React from 'react';
import { IconButton } from '@material-ui/core';
import { Edit, Functions, Widgets } from '@material-ui/icons';
import { WidgetProp, ComponentConfig } from '@ui-builder/types';
import { StaticConfig } from 'components/ConfigOption/StaticConfig';
import { VariableConfig } from 'components/ConfigOption/VariableConfig';
import { WidgetConfig } from 'components/ConfigOption/WidgetConfig';

import * as Styles from './ConfigOption.styles';

interface ConfigOptionProps {
  widgetProp: WidgetProp;
  config: ComponentConfig;
  onChange: (prop: WidgetProp) => void;
  onModeChange: (mode: 'static' | 'variable' | 'widget') => void;
}

export const ConfigOption = ({
  widgetProp,
  config,
  onChange,
  onModeChange,
}: ConfigOptionProps): JSX.Element => {
  const handleToggleMode = (m: 'static' | 'variable' | 'widget') => () => onModeChange(m);

  if (!widgetProp) {
    onModeChange('static');
    return <div />;
  }

  const getColor = (m: 'static' | 'variable' | 'widget') =>
    widgetProp.mode === m ? '#fa7268' : '#9c9c9c';

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
