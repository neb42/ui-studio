import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from 'styled-components';
import Tabs from '@faculty/adler-web-components/atoms/Tabs';
import Button from '@faculty/adler-web-components/atoms/Button';
import { Store } from 'types/store';
import { makeGetElement, makeGetSelectedElement } from 'selectors/element';
import { ElementIcon } from 'components/ElementIcon';
import { GridLayoutConfig } from 'components/Grid/GridLayoutConfig/GridLayoutConfig';
import { FlexLayoutConfig } from 'components/Flex/FlexLayoutConfig';
import { GridParentStyle } from 'components/Grid/GridParentStyle';
import { FlexParentStyle } from 'components/Flex/FlexParentStyle';
import { WidgetConfig } from 'components/WidgetConfig';
import { CSSInput } from 'components/CSSInput';
import { ClassNamesInput } from 'components/ClassNamesInput';
import { EventConfig } from 'components/EventConfig';
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

  if (selectedElement === null) {
    return <Styles.Container>No element selected</Styles.Container>;
  }

  const tabHeaders = [{ content: 'Config' }, { content: 'Styles' }];
  if (selectedElement.type === 'widget') {
    tabHeaders.push({ content: 'Events' });
  }

  return (
    <Styles.Container>
      <Styles.Header>
        <ElementIcon element={selectedElement} color={theme.colors.text.secondary} />
        <EditName element={selectedElement} component={Styles.ComponentName} />
        <Tabs tabHeaders={tabHeaders} onTabChange={(_, idx: number) => setTabIndex(idx)} />
      </Styles.Header>
      <Styles.Body>
        {tabIndex === 0 &&
          selectedElement.type === 'layout' &&
          selectedElement.layoutType === 'grid' && <GridLayoutConfig layout={selectedElement} />}
        {tabIndex === 0 &&
          selectedElement.type === 'layout' &&
          selectedElement.layoutType === 'flex' && <FlexLayoutConfig layout={selectedElement} />}
        {tabIndex === 0 && selectedElement.type === 'widget' && (
          <WidgetConfig widget={selectedElement} />
        )}
        {tabIndex === 1 &&
          selectedElement?.type !== 'page' &&
          parentElement?.type === 'layout' &&
          parentElement?.layoutType === 'grid' && (
            <GridParentStyle element={selectedElement} parent={parentElement} />
          )}
        {tabIndex === 1 &&
          selectedElement?.type !== 'page' &&
          parentElement?.type === 'layout' &&
          parentElement?.layoutType === 'flex' && <FlexParentStyle element={selectedElement} />}
        {tabIndex === 1 && <ClassNamesInput element={selectedElement} />}
        {tabIndex === 1 && <CSSInput element={selectedElement} />}
        {selectedElement.type === 'widget' && tabIndex === 2 && (
          <EventConfig widget={selectedElement} />
        )}
      </Styles.Body>
    </Styles.Container>
  );
};
