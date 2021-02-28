import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 16px;
`;

export const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.secondary400};
  margin: 0 -24px;
`;
