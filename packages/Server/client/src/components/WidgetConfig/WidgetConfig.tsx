import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@material-ui/core';
import { Widget } from '@ui-builder/types';
import { updateWidgetProps } from 'actions/widget';
import { makeGetComponents } from 'selectors/element';
import { TComponentConfig } from 'types/store';

import * as Styles from './WidgetConfig.styles';

interface IWidgetConfig {
  widget: Widget;
}

export const WidgetConfig = ({ widget }: IWidgetConfig): JSX.Element => {
  const dispatch = useDispatch();
  const components = useSelector(makeGetComponents());
  const component = components.find((c) => c.name === widget.component);

  const handleOnChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateWidgetProps(widget.name, key, event.target.value));
  };

  const renderConfigItem = (c: TComponentConfig) => {
    switch (c.component) {
      case 'input':
        return (
          <TextField
            label={c.label}
            onChange={handleOnChange(c.key)}
            value={widget.props[c.key] || ''}
          />
        );
      // case 'select':
      //   return;
      default:
        return null;
    }
  };

  if (!component) return <div />;

  return <Styles.Container>{component.config.map(renderConfigItem)}</Styles.Container>;
};
