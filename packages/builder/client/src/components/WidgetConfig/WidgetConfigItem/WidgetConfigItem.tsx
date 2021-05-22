import * as React from 'react';
import { useSelector } from 'react-redux';
import Button from '@faculty/adler-web-components/atoms/Button';
import { WidgetProp, WidgetProp$List, ComponentConfig, Mode } from '@ui-studio/types';
import { WidgetModel } from 'models/widget';
import { getAvailableIteratorKeys } from 'selectors/element';
import { ModeButtons } from 'components/WidgetConfig/ModeButtons';
import { WidgetConfigCard } from 'components/WidgetConfig/WidgetConfigCard';

import * as Styles from './WidgetConfigItem.styles';

interface WidgetConfigProps {
  widgetId: string;
  rootType: 'page' | 'customComponent';
  widgetProp: WidgetProp;
  config: ComponentConfig;
  onChange: (prop: WidgetProp) => any;
}

export const WidgetConfigItem = ({
  widgetId,
  rootType,
  widgetProp,
  config,
  onChange,
}: WidgetConfigProps): JSX.Element => {
  const hasIterableParent = useSelector(getAvailableIteratorKeys)(widgetId).length > 0;

  const handleAddPropToList = () => {
    if (widgetProp.mode !== 'list') throw Error();
    const defaultProp = WidgetModel.getDefaultProp(
      config.component === 'complex' ? 'complex' : 'static',
      { ...config, list: false } as ComponentConfig,
    );
    if (defaultProp.mode === 'list' || defaultProp.mode === 'iterable') throw Error();
    const prop: WidgetProp$List = { ...widgetProp };
    prop.props.push(defaultProp);
    onChange(prop);
  };

  const handleModeChange = (mode: Mode) => {
    const defaultProp = WidgetModel.getDefaultProp(mode, config, widgetProp);
    onChange(defaultProp);
  };

  const handlePropChange = (prop: WidgetProp) => onChange(prop);

  const handleListPropChange = (idx: number) => (subProp: WidgetProp) => {
    if (widgetProp.mode !== 'list' || subProp.mode === 'list' || subProp.mode === 'iterable')
      throw Error();
    const prop: WidgetProp$List = { ...widgetProp };
    prop.props[idx] = subProp;
    onChange(prop);
  };

  const handleRemoveListProp = (idx: number) => () => {
    if (widgetProp.mode !== 'list') throw Error();
    const prop: WidgetProp$List = { ...widgetProp };
    prop.props = prop.props.filter((_, i) => i !== idx);
    onChange(prop);
  };

  const modeOptions = ((): Mode[] => {
    const modes: Mode[] = ['static', 'variable'];

    if (config.list) modes.push('list');
    else if (config.component === 'complex') modes.push('complex');
    else modes.push('widget');

    if (hasIterableParent) modes.push('iterable');

    if (rootType === 'customComponent') modes.push('customComponentConfig');

    return modes;
  })();

  return (
    <Styles.Container>
      <Styles.Label>{config.label}</Styles.Label>
      {widgetProp.mode === 'list' ? (
        <Button
          icon="add"
          style={Button.styles.naked}
          size={Button.sizes.medium}
          color={Button.colors.secondary}
          onClick={handleAddPropToList}
        />
      ) : (
        <div />
      )}
      <div style={{ width: 24 }} />
      <ModeButtons
        mode={widgetProp.mode}
        modeOptions={modeOptions}
        onModeChange={handleModeChange}
      />
      {widgetProp.mode === 'list' ? (
        widgetProp.props.map((p, i) => (
          <WidgetConfigCard
            key={i}
            widgetId={widgetId}
            widgetProp={p}
            config={{ ...config, list: false } as ComponentConfig}
            onChange={handleListPropChange(i)}
            onDelete={handleRemoveListProp(i)}
          />
        ))
      ) : (
        <WidgetConfigCard
          widgetId={widgetId}
          widgetProp={widgetProp}
          config={config}
          onChange={handlePropChange}
        />
      )}
    </Styles.Container>
  );
};
