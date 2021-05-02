import * as React from 'react';
import Button from '@faculty/adler-web-components/atoms/Button';
import { WidgetProp, WidgetProp$Complex, ComponentConfig } from '@ui-studio/types';

import { StaticConfig } from 'components/WidgetConfig/Source/StaticConfig';
import { VariableConfig } from 'components/WidgetConfig/Source/VariableConfig';
import { WidgetConfig } from 'components/WidgetConfig/Source/WidgetConfig';
import { IterableConfig } from 'components/WidgetConfig/Source/IterableConfig';

import * as Styles from './WidgetConfigCard.styles';

interface Props {
  widgetId: string;
  widgetProp: WidgetProp;
  config: ComponentConfig;
  onChange: (prop: WidgetProp) => any;
  onDelete?: () => any;
  label?: string;
}

const Single = ({ widgetId, widgetProp, config, onChange, label }: Props) => {
  if (widgetProp.mode === 'complex' && config.component === 'complex') {
    const handleComplexPropChange = (key: string) => (subProp: WidgetProp) => {
      if (subProp.mode === 'complex' || subProp.mode === 'list' || subProp.mode === 'iterable')
        throw Error();
      const prop: WidgetProp$Complex = { ...widgetProp };
      prop.props[key] = subProp;
      onChange(prop);
    };
    return (
      <>
        {Object.keys(widgetProp.props).map((k, i) => (
          <Single
            key={k}
            widgetId={widgetId}
            widgetProp={widgetProp.props[k]}
            config={config.config[i]}
            onChange={handleComplexPropChange(k)}
            label={config.config[i].label}
          />
        ))}
      </>
    );
  }
  if (widgetProp.mode === 'static') {
    return (
      <StaticConfig widgetProp={widgetProp} config={config} onChange={onChange} label={label} />
    );
  }
  if (widgetProp.mode === 'variable') {
    return <VariableConfig widgetProp={widgetProp} config={config} onChange={onChange} />;
  }
  if (widgetProp.mode === 'widget') {
    return <WidgetConfig widgetProp={widgetProp} onChange={onChange} />;
  }
  if (widgetProp.mode === 'iterable') {
    return <IterableConfig widgetId={widgetId} widgetProp={widgetProp} onChange={onChange} />;
  }
  return null;
};

export const WidgetConfigCard = ({
  widgetId,
  widgetProp,
  config,
  onChange,
  onDelete,
}: Props): JSX.Element => {
  return (
    <Styles.Container>
      {onDelete ? (
        <Button
          icon="delete"
          style={Button.styles.naked}
          size={Button.sizes.medium}
          color={Button.colors.danger}
          onClick={onDelete}
        />
      ) : (
        <div />
      )}
      <Single widgetId={widgetId} widgetProp={widgetProp} config={config} onChange={onChange} />
    </Styles.Container>
  );
};
