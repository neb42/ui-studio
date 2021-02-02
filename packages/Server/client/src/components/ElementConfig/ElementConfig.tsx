import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from 'styled-components';
import Tabs from '@faculty/adler-web-components/atoms/Tabs';
import Input from '@faculty/adler-web-components/atoms/Input';
import Button from '@faculty/adler-web-components/atoms/Button';
import { Store } from 'types/store';
import { makeGetElement, makeGetSelectedElement } from 'selectors/element';
import { updateElementName } from 'actions/element';
import { ElementIcon } from 'components/ElementIcon';
import { GridLayoutConfig } from 'components/Grid/GridLayoutConfig/GridLayoutConfig';
import { FlexLayoutConfig } from 'components/Flex/FlexLayoutConfig';
import { GridParentStyle } from 'components/Grid/GridParentStyle';
import { FlexParentStyle } from 'components/Flex/FlexParentStyle';
import { WidgetConfig } from 'components/WidgetConfig';
import { CSSInput } from 'components/CSSInput';
import { ClassNamesInput } from 'components/ClassNamesInput';
import { EventConfig } from 'components/EventConfig';

import * as Styles from './ElementConfig.styles';

export const ElementConfig = (): JSX.Element => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const getElement = React.useMemo(makeGetElement, []);
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const selectedElement = useSelector(getSelectedElement);
  const [name, setName] = React.useState(selectedElement?.name ?? '');
  const [tabIndex, setTabIndex] = React.useState(0);
  const [edit, setEdit] = React.useState(false);

  const parentName =
    !selectedElement || selectedElement.type === 'page' ? null : selectedElement.parent;
  const parentElement = useSelector((state: Store) => getElement(state, parentName));

  React.useEffect(() => {
    if (selectedElement && selectedElement.name !== name) {
      setName(selectedElement.name);
    }
  }, [selectedElement?.name]);

  const handleOnNameChange = (value: string) => {
    setName(value || '');
  };

  const handleOnNameBlur = () => {
    if (selectedElement) {
      dispatch(updateElementName(selectedElement.id, selectedElement.type, name));
    }
  };

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
        {edit ? (
          <Input
            value={name}
            onChange={handleOnNameChange}
            onBlur={handleOnNameBlur}
            error={name.length === 0 ? 'Required' : undefined}
          />
        ) : (
          <Styles.ComponentName>{name}</Styles.ComponentName>
        )}
        <div />
        <Button
          icon="edit"
          style={Button.styles.naked}
          color={edit ? Button.colors.brand : Button.colors.secondary}
          size={Button.sizes.medium}
          onClick={() => setEdit(!edit)}
        />
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
