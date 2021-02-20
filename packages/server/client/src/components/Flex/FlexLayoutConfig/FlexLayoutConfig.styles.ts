import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: auto;
  row-gap: 24px;
`;

export const Field = styled.div`
  display: grid;
  grid-template-columns: auto;
  row-gap: 8px;
`;

export const FieldHeader = styled.div`
  font-weight: 500;
  text-transform: capitalize;
`;
