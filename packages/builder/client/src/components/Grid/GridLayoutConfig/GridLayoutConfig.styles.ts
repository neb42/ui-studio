import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 24px;
  column-gap: 16px;

  & > * {
    grid-column: 1/-1;
  }

  & > *:nth-child(2) {
    grid-column: 1;
  }

  & > *:nth-child(3) {
    grid-column: 2;
  }

  & > *:nth-child(4) {
    grid-column: 1;
  }

  & > *:nth-child(5) {
    grid-column: 2;
  }
`;
