import * as React from 'react';
import { useSelector } from 'react-redux';
import { Widget } from 'canvas-types';
import { makeGetComponents } from 'selectors/element';
import { StandardConfig } from 'components/ConfigOption/StandardConfig';
import { ListConfig } from 'components/ConfigOption/ListConfig';

import * as Styles from './WidgetConfig.styles';

interface WidgetConfigProps {
  widget: Widget;
}

export const WidgetConfig = ({ widget }: WidgetConfigProps): JSX.Element => {
  const components = useSelector(makeGetComponents());
  const component = components.find((c) => c.name === widget.component);

  if (!component) return <div />;

  return (
    <Styles.Container>
      {component.config.map((c) => {
        if (c.list) return <ListConfig key={c.key} widget={widget} config={c} />;
        return <StandardConfig key={c.label} widget={widget} config={c} />;
      })}
    </Styles.Container>
  );
};
