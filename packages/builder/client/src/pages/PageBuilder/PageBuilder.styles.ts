import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  width: 100%;
`;

export const Body = styled.div`
  display: grid;
  grid-template-columns: 48px 300px 1fr 300px;
  overflow: hidden;
`;

export const ColLeft = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.secondary300};
`;

export const PopoverContainer = styled.div`
  height: calc(100vh - 55px);
  width: calc(100vw - 600px - 48px);
  position: fixed;
  left: 348px;
  top: calc(55px);
  background-color: ${({ theme }) => theme.colors.background.light};
`;
