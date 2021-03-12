import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  row-gap: 16px;
  column-gap: 16px;
  align-items: flex-start;

  padding: 8px;
  background-color: #fff;
  box-shadow: rgb(232 232 232) 0px 3px 2px 0px;

  & > * {
    grid-column: 1;
  }

  & > *:nth-child(1) {
    grid-column: 2;
  }

  & > *:nth-child(2) {
    grid-row: 1;
  }

  & > *:nth-child(3) {
    grid-row: 2;
  }

  & > *:nth-child(4) {
    grid-row: 3;
  }
`;
