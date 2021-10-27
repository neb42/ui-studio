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

type TabHeaders = 'Config' | 'Properties' | 'Layout' | 'Events' | 'Styles';

export const ElementConfigComponent = ({
  selectedElement,
  parentElement,
  hasConfig,
  hasEvents,
  hasLayout,
}: Props): JSX.Element => {
  // Default to "Config" as it will be the left most tab if it exists
  const [tabKey, setTabKey] = React.useState<TabHeaders>('Config');

  const tabHeaders = (() => {
    const th: TabHeaders[] = [];
    if (selectedElement?.type === 'customComponent') {
      th.push('Config');
      th.push('Properties');
    }
    if (hasConfig) th.push('Config');
    if (hasLayout) th.push('Layout');
    if (hasEvents) th.push('Events');
    th.push('Styles');
    return th;
  })();

  React.useEffect(() => {
    if (!tabHeaders.includes(tabKey)) setTabKey(tabHeaders[0]);
  }, [JSON.stringify(tabHeaders)]);

  if (!selectedElement) {
    return <Styles.Container />;
  }

  const tabIndex = tabHeaders.findIndex((t) => t === tabKey);

  const handleTabChange = (_: any, newValue: number) => {
    setTabKey(tabHeaders[newValue]);
  };

  const isSelected = (k: TabHeaders) => k === tabKey;

  return (
    <Styles.Container>
      <Styles.Header>
        <EditName element={selectedElement} />
        <Tabs value={tabIndex} onChange={handleTabChange}>
          {tabHeaders.map((h) => (
            <Tab key={h} label={h} />
          ))}
        </Tabs>
      </Styles.Header>
      <Styles.Body>
        {selectedElement.type === 'customComponent' && isSelected('Config') && (
          <CustomComponentConfig
            key={`custom-component-config-${selectedElement.id}`}
            customComponent={selectedElement}
          />
        )}
        {selectedElement.type === 'customComponent' && isSelected('Properties') && (
          <ExposedProperties
            key={`exposed-properties-${selectedElement.id}`}
            customComponent={selectedElement}
          />
        )}
        {hasConfig && !selectedElement.rootElement && isSelected('Config') && (
          <WidgetConfig key={`widget-config-${selectedElement.id}`} widget={selectedElement} />
        )}
        {hasLayout && !selectedElement.rootElement && isSelected('Layout') && (
          <LayoutConfig key={`layout-config-${selectedElement.id}`} widget={selectedElement} />
        )}
        {!selectedElement.rootElement && isSelected('Events') && (
          <EventConfig key={`event-config-${selectedElement.id}`} widget={selectedElement} />
        )}
        {isSelected('Styles') && (
          <StyleConfig
            key={`style-config-${selectedElement.id}`}
            element={selectedElement}
            parentElement={parentElement}
          />
        )}
      </Styles.Body>
    </Styles.Container>
  );
};
