import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { makeGetSelectedElement } from 'selectors/element';
import { addWidget } from 'actions/widget';
import { addLayout } from 'actions/layout';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const AddElementButtons = (): JSX.Element => {
  const dispatch = useDispatch();
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const selectedElement = useSelector(getSelectedElement);

  const handleAddGrid = () => {
    if (selectedElement) {
      dispatch(addLayout('grid', selectedElement.name));
    }
  };

  const handleAddFlex = () => {
    if (selectedElement) {
      dispatch(addLayout('flex', selectedElement.name));
    }
  };

  const handleAddText = () => {
    if (selectedElement) {
      dispatch(addWidget('text', selectedElement.name));
    }
  };

  return (
    <Container>
      <Button
        onClick={handleAddGrid}
        variant="contained"
        color="primary"
        size="small"
        disabled={!selectedElement || selectedElement.type === 'widget'}
        disableElevation
      >
        Add grid
      </Button>
      <Button
        onClick={handleAddFlex}
        variant="contained"
        color="primary"
        size="small"
        disabled={!selectedElement || selectedElement.type === 'widget'}
        disableElevation
      >
        Add flex
      </Button>
      <Button
        onClick={handleAddText}
        variant="contained"
        color="primary"
        size="small"
        disabled={!selectedElement || selectedElement.type === 'widget'}
        disableElevation
      >
        Add text
      </Button>
    </Container>
  );
};
