import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  column-gap: ${({ theme }) => theme.spacing(1)};
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.header.background.color};
  box-shadow: 0 5px 10px 0 ${({ theme }) => theme.header.boxshadow.color};
`;
