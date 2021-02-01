import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 24px;
  row-gap: 8px;
`;

export const ModeButtons = styled.div`
  grid-row: 1;
  grid-column: 2;
  align-self: end;
`;
