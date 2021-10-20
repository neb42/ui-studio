import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Element } from '@ui-studio/types';
import { CustomComponentConfig } from 'components/CustomComponent/CustomComponentConfig';
import { ExposedProperties } from 'components/CustomComponent/ExposedProperties';
import { WidgetConfig } from 'components/WidgetConfig';
import { LayoutConfig } from 'components/LayoutConfig';
import { EventConfig } from 'components/EventConfig';
import { StyleConfig } from 'components/Styles/StyleConfig';
import { EditName } from 'components/EditName';

import * as Styles from './ElementConfig.styles';

type Props = {
  selectedElement: Element | null;
  parentElement: Element | null;
  hasConfig: boolean;
  hasEvents: boolean;
  hasLayout: boolean;
};

export const ElementConfigComponent = ({
  selectedElement,
  parentElement,
  hasConfig,
  hasEvents,
  hasLayout,
}: Props): JSX.Element => {
  const [tabIndex, setTabIndex] = React.useState(0);

  if (!selectedElement) {
    return <Styles.Container />;
  }

  const tabHeaders = (() => {
    const th = [];
    if (selectedElement.type === 'customComponent') {
      th.push('Config');
      th.push('Properties');
    }
    if (hasConfig) th.push('Config');
    if (hasLayout) th.push('Layout');
    if (hasEvents) th.push('Events');
    th.push('Styles');
    return th;
  })();

  const handleTabChange = (_: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const isSelected = (key: string) => tabHeaders.findIndex((k) => k === key) === tabIndex;

  return (
    <Styles.Container>
      <Styles.Header>
        <EditName element={selectedElement} component={Styles.ComponentName} />
        <Tabs value={tabIndex} onChange={handleTabChange}>
          {tabHeaders.map((h) => (
            <Tab key={h} label={h} />
          ))}
        </Tabs>
      </Styles.Header>
      <Styles.Body>
        {selectedElement.type === 'customComponent' && isSelected('Config') && (
          <CustomComponentConfig customComponent={selectedElement} />
        )}
        {selectedElement.type === 'customComponent' && isSelected('Properties') && (
          <ExposedProperties customComponent={selectedElement} />
        )}
        {hasConfig && !selectedElement.rootElement && isSelected('Config') && (
          <WidgetConfig widget={selectedElement} />
        )}
        {hasLayout && !selectedElement.rootElement && isSelected('Layout') && (
          <LayoutConfig widget={selectedElement} />
        )}
        {!selectedElement.rootElement && isSelected('Events') && (
          <EventConfig widget={selectedElement} />
        )}
        {isSelected('Styles') && (
          <StyleConfig element={selectedElement} parentElement={parentElement} />
        )}
      </Styles.Body>
    </Styles.Container>
  );
};
