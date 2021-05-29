import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '@faculty/adler-web-components/atoms/Icon';
import Button from '@faculty/adler-web-components/atoms/Button';
import { Variable } from '@ui-studio/types';
import { addVariable, removeVariable } from 'actions/variable';
import { selectVariable } from 'actions/view';
import { getVariables } from 'selectors/variable';
import { getSelectedVariableId } from 'selectors/view';

import * as Styles from './VariableList.styles';

export const VariableList = () => {
  const dispatch = useDispatch();
  const selectedVariableId = useSelector(getSelectedVariableId);
  const variables: Variable[] = Object.values(useSelector(getVariables));

  const handleAddVariable = () => dispatch(addVariable());

  const handleSelectVariable = (id: string) => () => dispatch(selectVariable(id));

  const handleDeleteVariable = (id: string) => () => dispatch(removeVariable(id));

  return (
    <Styles.Container>
      <Styles.Header>
        <Styles.HeaderTitle>Variables</Styles.HeaderTitle>
        <Button
          icon="add"
          color={Button.colors.secondary}
          style={Button.styles.naked}
          size={Button.sizes.medium}
          onClick={handleAddVariable}
        />
      </Styles.Header>
      <Styles.VariableList>
        {variables.map((v) => (
          <Styles.VariableItem
            key={v.id}
            onClick={handleSelectVariable(v.id)}
            active={v.id === selectedVariableId}
          >
            <Icon name="help" color={(theme) => theme.colors.primary} size={Icon.sizes.large} />
            <Styles.Name>{v.name}</Styles.Name>
            <Styles.Actions selected={selectedVariableId === v.id}>
              <Button
                icon="delete"
                style={Button.styles.naked}
                color={Button.colors.secondary}
                size={Button.sizes.medium}
                onClick={handleDeleteVariable(v.id)}
              />
            </Styles.Actions>
          </Styles.VariableItem>
        ))}
      </Styles.VariableList>
    </Styles.Container>
  );
};
