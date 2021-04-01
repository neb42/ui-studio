import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import Tabs from '@faculty/adler-web-components/atoms/Tabs';
import { Store } from 'types/store';
import { makeGetElement, makeGetSelectedElement, makeGetComponents } from 'selectors/element';
import { ElementIcon } from 'components/ElementIcon';
import { WidgetConfig } from 'components/WidgetConfig';
import { LayoutConfig } from 'components/LayoutConfig';
import { EventConfig } from 'components/EventConfig';
import { StyleConfig } from 'components/StyleConfig';
import { EditName } from 'components/EditName/EditName';

import * as Styles from './ElementConfig.styles';

export const ElementConfig = (): JSX.Element => {
  const theme = useTheme();
  const getElement = React.useMemo(makeGetElement, []);
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const selectedElement = useSelector(getSelectedElement);
  const [tabIndex, setTabIndex] = React.useState(0);

  const parentName =
    !selectedElement || selectedElement.type === 'page' ? null : selectedElement.parent;
  const parentElement = useSelector((state: Store) => getElement(state, parentName));

  const component = useSelector(React.useMemo(makeGetComponents, [])).find((c) => {
    if (selectedElement?.type !== 'widget') return false;
    return c.key === selectedElement.component;
  });

  if (selectedElement === null) {
    return <Styles.Container>No element selected</Styles.Container>;
  }

  const hasConfig = Boolean(component && component.config && component.config.length > 0);
  const hasEvents = Boolean(component && component.events && component.events.length > 0);
  const hasLayout = Boolean(component?.hasLayout);

  const tabHeaders = (() => {
    const th = [];
    if (hasConfig) th.push('Config');
    if (hasLayout) th.push('Layout');
    if (hasEvents) th.push('Events');
    th.push('Styles');
    return th;
  })();

  const isSelected = (key: string) => tabHeaders.findIndex((k) => k === key) === tabIndex;

  return (
    <Styles.Container>
      <Styles.Header>
        <ElementIcon element={selectedElement} color={theme.colors.text.secondary} />
        <EditName element={selectedElement} component={Styles.ComponentName} />
        <Tabs
          tabHeaders={tabHeaders.map((k) => ({ content: k }))}
          onTabChange={(_, idx: number) => setTabIndex(idx)}
        />
      </Styles.Header>
      <Styles.Body>
        {hasConfig && selectedElement.type === 'widget' && isSelected('Config') && (
          <WidgetConfig widget={selectedElement} />
        )}
        {hasLayout && selectedElement.type === 'widget' && isSelected('Layout') && (
          <LayoutConfig widget={selectedElement} />
        )}
        {selectedElement.type === 'widget' && isSelected('Events') && (
          <EventConfig widget={selectedElement} />
        )}
        {isSelected('Styles') && (
          <StyleConfig element={selectedElement} parentElement={parentElement} />
        )}
      </Styles.Body>
    </Styles.Container>
  );
};
