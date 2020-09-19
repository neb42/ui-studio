import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeGetSelectedElement } from 'selectors/element';
import { TextField } from '@material-ui/core';
import { updateElement, updateElementName } from 'actions/element';

import { makeIsValidElementName } from '../../selectors/element';

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

  return (
    <Styles.Container>
      <Styles.Field>
        <TextField
          id="name"
          label="Name"
          value={name}
          required
          onChange={handleOnNameChange}
          error={isValidElementName(name || '')}
        />
        {selectedElement.type === 'widget' &&
          widgetConfigMap[selectedElement.component].map((c) => renderField(c))}
      </Styles.Field>
    </Styles.Container>
  );
};
