import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  width: 100%;
`;

export const Body = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  overflow: hidden;
`;

export const ColLeft = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  border-right: 1px solid ${({ theme }) => theme.colors.secondary300};
`;
