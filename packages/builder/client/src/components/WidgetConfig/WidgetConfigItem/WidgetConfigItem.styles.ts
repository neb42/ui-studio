import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-template-rows: 36px auto;
  align-items: center;
  row-gap: 8px;
  column-gap: 8px;
  margin-bottom: 16px;
  position: relative;

  & > * {
    grid-column: 1/-1;
  }

  & > *:nth-child(1) {
    grid-column: 1;
  }

  & > *:nth-child(2) {
    grid-column: 2;
  }

  & > *:nth-child(3) {
    grid-column: 3;
  }
`;

export const Header = styled.div``;

export const Label = styled.div``;
