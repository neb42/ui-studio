import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 24px;
`;

export const ConfigItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 24px;
  row-gap: 16px;

  & > * {
    grid-column: 1/-1;
  }

  & > *:nth-child(1) {
    grid-column: 2;
    grid-row: 1;
    align-self: start;
  }

  & > *:nth-child(2) {
    grid-column: 1;
    grid-row: 1;
  }

  & > button::first-of-type {
    width: 100%;
  }

  & .MuiCheckbox-root {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

export const SelectOption = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 24px;
`;
