import * as React from 'react';
import Button from '@faculty/adler-web-components/atoms/Button';
import { WidgetProp, WidgetProp$List, WidgetProp$Complex, ComponentConfig } from 'canvas-types';
import { StaticConfig } from 'components/WidgetConfig/Source/StaticConfig';
import { VariableConfig } from 'components/WidgetConfig/Source/VariableConfig';
import { WidgetConfig } from 'components/WidgetConfig/Source/WidgetConfig';

import * as Styles from './WidgetConfigCard.styles';

interface Props {
  widgetProp: WidgetProp;
  config: ComponentConfig;
  onChange: (prop: WidgetProp) => any;
  onDelete?: () => any;
}

const Single = ({ widgetProp, config, onChange }: Props) => {
  if (widgetProp.mode === 'complex' && config.component === 'complex') {
    const handleComplexPropChange = (key: string) => (subProp: WidgetProp) => {
      if (subProp.mode === 'complex' || subProp.mode === 'list') throw Error();
      const prop: WidgetProp$Complex = { ...widgetProp };
      prop.props[key] = subProp;
      onChange(prop);
    };
    return (
      <>
        {Object.keys(widgetProp.props).map((k, i) => (
          <Single
            key={k}
            widgetProp={widgetProp.props[k]}
            config={config.config[i]}
            onChange={handleComplexPropChange(k)}
          />
        ))}
      </>
    );
  }
  if (widgetProp.mode === 'static') {
    return <StaticConfig widgetProp={widgetProp} config={config} onChange={onChange} />;
  }
  if (widgetProp.mode === 'variable') {
    return <VariableConfig widgetProp={widgetProp} config={config} onChange={onChange} />;
  }
  if (widgetProp.mode === 'widget') {
    return <WidgetConfig widgetProp={widgetProp} onChange={onChange} />;
  }
  return null;
};

export const WidgetConfigCard = ({
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
      <Single widgetProp={widgetProp} config={config} onChange={onChange} />
    </Styles.Container>
  );
};
