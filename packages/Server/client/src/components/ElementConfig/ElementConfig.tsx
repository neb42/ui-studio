import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tab, Tabs, TextField } from '@material-ui/core';
import { makeGetSelectedElement, makeIsValidElementName } from 'selectors/element';
import { updateElement, updateElementName } from 'actions/element';
import { GridLayoutConfig } from 'components/GridLayoutConfig/GridLayoutConfig';

import * as Styles from './ElementConfig.styles';

interface WidgetConfig {
  component: 'input';
  key: string;
  label: string;
}

const widgetConfigMap: { [key: string]: WidgetConfig[] } = {
  text: [{ component: 'input', key: 'children', label: 'Text' }],
};

export const ElementConfig = (): JSX.Element => {
  const dispatch = useDispatch();
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const isValidElementName = useSelector(React.useMemo(makeIsValidElementName, []));
  const selectedElement = useSelector(getSelectedElement);
  const [name, setName] = React.useState(selectedElement?.name);
  const [tabIndex, setTabIndex] = React.useState(0);

  React.useEffect(() => {
    if (selectedElement && selectedElement.name !== name) {
      setName(selectedElement.name);
    }
  }, [selectedElement?.name]);

  const handleOnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event?.target?.value;
    if (newName) {
      setName(newName);

      if (isValidElementName(newName) && selectedElement) {
        dispatch(updateElementName(selectedElement.name, selectedElement.type, newName));
      }
    }
  };

  if (selectedElement === null) {
    return <Styles.Container>No element selected</Styles.Container>;
  }

  const renderField = (config: WidgetConfig) => {
    switch (config.component) {
      case 'input': {
        return (
          <TextField
            id={config.key}
            label={config.label}
            value={selectedElement.props[config.key] || ''}
            multiline
            rowsMax={4}
            onChange={(e) =>
              dispatch(
                updateElement(
                  selectedElement.name,
                  selectedElement.type,
                  config.key,
                  e.target.value,
                ),
              )
            }
          />
        );
      }
      default:
        return null;
    }
  };

  const componentName = (() => {
    switch (selectedElement.type) {
      case 'page':
        return 'Page';
      case 'layout': {
        switch (selectedElement.layoutType) {
          case 'grid':
            return 'Grid layout';
          case 'flex':
            return 'Flex layout';
          default:
            return 'Unknown';
        }
      }
      case 'widget': {
        switch (selectedElement.component) {
          case 'text':
            return 'Text';
          default:
            return 'Unknown';
        }
      }
      default:
        return 'Unknown';
    }
  })();

  return (
    <Styles.Container>
      <Styles.Header>
        <Styles.ComponentName>{componentName}</Styles.ComponentName>
        <TextField
          id="name"
          value={name}
          required
          onChange={handleOnNameChange}
          error={isValidElementName(name || '')}
        />
      </Styles.Header>
      <Tabs variant="fullWidth" value={tabIndex} onChange={(_, newIdx) => setTabIndex(newIdx)}>
        <Tab label="Config" />
        <Tab label="Style" />
      </Tabs>
      <Styles.Field>
        {selectedElement.type === 'widget' &&
          widgetConfigMap[selectedElement.component].map((c) => renderField(c))}
        {selectedElement.type === 'layout' && selectedElement.layoutType === 'grid' && (
          <GridLayoutConfig />
        )}
      </Styles.Field>
    </Styles.Container>
  );
};
